### Challenge Documentation
*In Line with the Instructions*

[![N|Solid](https://www.web3bridge.com/images/logo-red-on-white.png)](https://www.web3bridge.com/)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

The Challenge requested that we create a parking lot management system.
I broke the challenge into three major stages.

- Making the Slot monitoring section to make sure it doesn't exceed 15
- Adding and removing items from the table and also an interactive search
- Local Storage || The Dashboard || vehicle Size monitoring & a little character hiding

## Slot Monitoring

> Two seperate logic to monitor and keep the slot count was implemented.
> First was from the front end to make sure that the input count doesn't
> exceed the number 15. It is implemented using the limits availaible with
> number form input and also a little slap from the back in JS to make sure
> a slot hasn't been used twice

## Adding And Removing Items fron the Table
> Instead of a very crazy UI or something of sort, I decided to just got for
> using a table to. So what happens is, the table has two major edit modes,
> one from adding an element and the other from using the search bar. Those
> two functions inject and pull data from the table. 
> For the Most part, the search logic is carried out with a filter to create
> a new array holding new data which matches the text from the search
> bar with the use of the include method and the search is called on every 
> onkeyup

### Using Local Storage
> The browser's local storage was used to hold data persistence for the project
> to make the experience last a little while and also to make it easier to pass 
> data over to the dashboard page.
> The little logic for this was to use the .setItem and getItem in a useful way
> Each submission of data checks for the presence of a previous storage (members)
> and the delete(modifief pay function) checks for a payment storage and creates
> if that isn't found. The dashboard page does a getItem after the page is 
> read to be completely loaded and if no data exist prior, defaults to zero. 


## Vehicle Size Monitoring and Character hiding
> A simple logic was implemented to check that the large vehicle size doesn't
> exceed the 5 threshold, during every addition to local storage, the number
> of previous large car input is counted and then checked to know it's not 
> crossing the limit. If it does, the page gives an alert and reloads for the
> user to retry. Also yeah, for the asteriking, I just realized It's not wise
> for everyone to see everyone elses Plate number, and mail..
> I collected the mail just in case there is a possible need to pass information
> over to the parked customer.

## Time Counter and Price Increase
> The time counter was implemented using a set time interval for every 30mins(1800000 sec)
> Instead of going for the 1hr for $15, the Interval takes the 30mins route to be able to 
> make the update reflect on the cost by getting the previous price with the getItem local-
> storage method and then add the new price with the setItem and also change the time from 
> 30:00 to 00:00. 
