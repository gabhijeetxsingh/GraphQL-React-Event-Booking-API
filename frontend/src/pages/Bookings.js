import React, {Component} from 'react';
import AuthCotext from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingControls from '../components/Bookings/BookingsControls/BookingControls';

class BoookingsPage extends Component {

    state = {
        isLoading : false,
        bookings : [],
        outputType : 'list'
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
                            price
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
                    mutation CancelBooking($id : ID!) {
                        cancelBooking(bookingId : $id) {
                            _id
                            title
                        }
                    }
                `,
            variables : {
                id : bookingId
            }
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

    changeOutputTypeHandler = (outputType) => {
        if(outputType === "list") {
            this.setState({outputType : 'list'})
        }
        else {
            this.setState({outputType : 'chart'})
        }
    }

    render() {
        let content = <Spinner/>;

        if(!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingControls activeOutputType={this.state.outputType} onChange={this.changeOutputTypeHandler}/>
                    <div>
                        {this.state.outputType === "list" ? (<BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>) : (<BookingChart bookings={this.state.bookings}/>)}
                    </div>
                </React.Fragment>
            )
        }
        return (
        <React.Fragment>
            {content}
        </React.Fragment>)
        
    }
}

export default BoookingsPage;