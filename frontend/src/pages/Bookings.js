import React, {Component} from 'react';
import AuthCotext from "../context/auth-context";
import Spinner from '../components/Spinner/Spinner';

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

    render() {
        return (
        <React.Fragment>
            {this.state.isLoading ? <Spinner/> : (
            <ul> 
                {this.state.bookings.map(booking => (<li key={booking._id}>{booking.event.title}={" "}{new Date(booking.createdAt).toLocaleString()}</li>))}
            </ul>)}
        </React.Fragment>)
        
    }
}

export default BoookingsPage;