import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const containerStyle =
{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    height : 80,
    padding : 15,
    marginTop : 10,
    margnBottom : 30,
    marginLeft:5,
    marginRight:5
}

const timeStyle =
{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    flexBasis:60,
    flexGrow: 1,
    color:'#9E9E9E'
}

const goalStyle =
{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flexStart',
    flexGrow: 4
}

const actionButtonStyle = 
{
    flexBasis:80,
    flexGrow: 1,
    textAlign: 'center'
}    

const textStyle = 
{
    margin:5
}

const sucessStyle = 
{
    margin:5,
    color:'green'
}

const failStyle = 
{
    margin:5,
    color:'red'
}

class CommitCard extends React.Component {

    constructor(props) {
        super();
    }

    onResolve = () =>
    {
        this.props.onResolve(this.props.data.commitmentId);
    }

    render()
    {

        var timeUp = false;
        var secondsLeft = this.props.data.endTimestamp - (Date.now()/1000);
        var timeIndicator = "left"

        if (secondsLeft < 0)
        {
            timeUp = true;
            secondsLeft = 0-secondsLeft;
            timeIndicator = "ago"
        }

        var minutesLeft = secondsLeft/60;
        var hoursLeft = minutesLeft/60;
        var daysLeft = hoursLeft/24;

        var timeScale = "days ";
        var timeLeft = daysLeft;
        var connectionText = "to"

        if(daysLeft > 1)
        {
            timeScale = "days " + timeIndicator;
            timeLeft = Math.round(daysLeft);
        }
        else if( hoursLeft > 1)
        {
            timeScale ="hours " + timeIndicator;;
            timeLeft = Math.round(hoursLeft);
        }
        else if( minutesLeft > 1)
        {
            timeScale = "min "+ timeIndicator;;
            timeLeft = Math.round(minutesLeft);
        }

         var goalText = this.props.data.goal;

        if(timeUp===true && this.props.data.state=== "ongoing")
        {
            timeLeft = "Time \nOut!"
            timeScale = "";
            goalText = "To "+ goalText;
            connectionText = "";
        }

        if(timeUp===false && this.props.data.state=== "ongoing")
        {
            goalText = "To "+ goalText;
            connectionText = "";
        }
 
        var connectionElement;

        if (this.props.data.state === "succeeded")
        {
            connectionText = "You succeeded to"
            connectionElement = <p style={sucessStyle}> {connectionText} </p>;
        }
        else if (this.props.data.state === "failed")
        {
            connectionText = "You failed to"
            connectionElement = <p style={failStyle}> {connectionText} </p>;
        }

        var actionButton = null;
        var timeLeftElement = <h3 style={{textAlign:"center", margin:5}}> {timeLeft} </h3>
        
        if(timeUp && this.props.data.state==="ongoing")
        {
            actionButton =
            <div style = {actionButtonStyle}>
                <RaisedButton
                  label = "Resolve"
                  primary = {true}
                  onTouchTap = {this.onResolve}
                  disabled = {false}
                /> 
            </div>

            timeLeftElement = <h5 style={{textAlign:"center", margin:5}}> {timeLeft} </h5>
        
        } 


        

        return (
            <Paper style={containerStyle} zDepth={1} >

                <div style = {timeStyle}>

                    <div>
                        {timeLeftElement}
                    </div>
                    <div>
                        <h6 style={textStyle}>
                            {timeScale}
                        </h6>
                    </div>

                </div>


                <div style = {goalStyle}>

                    {connectionElement}

                    <h5 style={textStyle}>
                        {goalText}
                    </h5>
                </div>

                {actionButton}
                
            </Paper>
        );
    }
}

export default CommitCard;