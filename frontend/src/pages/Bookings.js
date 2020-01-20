import React, {Component} from 'react';
import AuthCotext from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BoookingsPage extends Component {

    state = {
        isLoading : false,
        bookings : []
    }

    isActive = true;

    static contextType = AuthCotext;

    componentDidMount () {
        this.fetchBookings();
    }

    componentWillUnmount () {
        this.isActive = false;
    }

    fetchBookings = () => {
        this.setState({isLoading : true});

        let requstBody = {
            query : `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `
        };

        fetch("http://localhost:4000/graphql", {
            method : "POST",
            body : JSON.stringify(requstBody),
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.context.token
            }
        })
        .then((res) => {
            if(res.status !==200 && res.status !==201) {
                throw new Error("Failed", res);
            }
            return res.json();
        })
        .then(resData=> {
            const {bookings} = resData.data;
            console.log(bookings);
            if(this.isActive) {
                this.setState({isLoading : false, bookings : bookings});
            }
        })
        .catch(err=> {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading : false});
            }
            

        })
  
    }

    deleteBookingHandler = bookingId => {
        this.setState({isLoading : true});

        let requstBody = {
            query : `
                mutation {
                    cancelBooking(bookingId : "${bookingId}") {
                        _id
                        title
                    }
                }
            `
        };

        fetch("http://localhost:4000/graphql", {
            method : "POST",
            body : JSON.stringify(requstBody),
            headers : {
                'Content-Type' : 'application/json',
                Authorization : 'Bearer '+this.context.token
            }
        })
        .then((res) => {
            if(res.status !==200 && res.status !==201) {
                throw new Error("Failed", res);
            }
            return res.json();
        })
        .then(resData=> {
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => {
                    return booking._id !==bookingId;
                });
                return {bookings : updatedBookings, isLoading : false}
            })
          
        })
        .catch(err=> {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading : false});
            }
            

        })
    }

    render() {
        return (
        <React.Fragment>
            {this.state.isLoading ? <Spinner/> : (
            <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>)}
        </React.Fragment>)
        
    }
}

export default BoookingsPage;