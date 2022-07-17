// This function will be run three times a day. It will get all the bookings and if the booking has expired it will delete it.

const axios = require('axios');
const booking = require('../../models/booking');

const checkBookings = () => {
    
    const data = {
        apiKey: "jfa9lkm30eKJ2SdlKS"
    };

    
    axios.post('http://localhost/home/getUserBookings', data)
    .then((res) => {
        const bookings = res.data;
        
        const bookingsToDelete = [];

        for(let booking of bookings) {
            if(compareDates(booking.endDate)) {
                bookingsToDelete.push({bookingId: booking.bookingId});
            }
        }

        if(Object.keys(bookingsToDelete).length > 0) {
            Object.assign(data, {bookingsToDelete: bookingsToDelete});

            axios.post('http://localhost/home/deleteBookingsApi', data)
            .then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })

        } else {
            console.log("No bookings to delete");
        }

    }).catch((err) => {
        console.error(err);
    });
}

const compareDates = (bookingEndDate) => {
    if(new Date() > new Date(bookingEndDate)) return true;
    else return false;
}

checkBookings();