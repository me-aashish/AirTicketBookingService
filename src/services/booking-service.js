const { default: axios } = require('axios');
const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index')

class BookingService{
    constructor(){
        this.bookingRepositoryObj = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;

            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get( getFlightRequestURL );

            const flightData = flight.data.data;

            let flightPrice = flightData.price;

            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something went wrong in booking process', 'Insufficient Seats for the booking request');
            }

            let totalCost = data.noOfSeats * flightPrice;

            const bookingPayload = {...data, totalCost};
            bookingPayload.flightId = parseInt(bookingPayload.flightId);
            bookingPayload.userId = parseInt(bookingPayload.userId);
            bookingPayload.noOfSeats = parseInt(bookingPayload.noOfSeats);
            
            const booking = await this.bookingRepositoryObj.create(bookingPayload);
            

            const updateFlightURL =`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            await axios.patch(updateFlightURL,{totalSeats : flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepositoryObj.update(booking.id,{status : 'Booked'})

            return finalBooking;
             
        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;