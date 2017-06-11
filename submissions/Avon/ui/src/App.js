import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Feed from './Feed';
import Creator from './Creator';
import Resolver from './Resolver';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import StatusIcon from 'material-ui/svg-icons/av/equalizer';
import IconButton from 'material-ui/IconButton';
import Notifier from './Notifier';
import Snackbar from 'material-ui/Snackbar';
import StatusContent from './StatusContent';

injectTapEventPlugin();


class App extends Component {
   
     constructor()
     {
        super();

        this.state = {
            currentPage:"Feed",
            notificationOpen:false,
            dialogOpen:false,
            notificationMessage:"",
            reload:true
        };

        Notifier.addListener(this.onNotified);
    }

    onNotified = (message) =>
    {
        this.setState({
          notificationOpen: true,
          notificationMessage:message
        });
    }

    onNotificationClosed = () => {
        this.setState({
          notificationOpen: false,
          notificationMessage:""
        });
    };

    closeDialog = () => {
        this.setState({dialogOpen: false});
    };

    openDialog = () => {
        this.setState({dialogOpen: true});
    };
    
    onNewCommit = () =>
    {
       this.setState({
            currentPage: "Creator",    
        });
    }

    onResolve = (commitmentId) =>
    {
       this.setState({
            currentPage: "Resolver",
            commitmentIdToResolve:commitmentId    
        });
    }


    onResolved = () =>
        {
           this.setState({
                currentPage: "Feed"  
            });
        }


    onLeftIconTap = () =>
    {
        if(this.state.currentPage === "Feed")
        {
            
        }
        else if (this.state.currentPage === "Creator")
        {
            this.setState({
                currentPage: "Feed",    
            });
        }

        else if (this.state.currentPage === "Resolver")
        {
            this.setState({
                currentPage: "Feed",    
            });
        }
    }

    onRightIconTap = () =>
    {
        this.openDialog();
    }

    onCommitmentCreated = ()=>
    {
        this.setState({
                currentPage: "Feed",    
            });
    }
  
  render() {

    var content =<Feed onNewCommit={this.onNewCommit} />;
    var leftIcon = <IconButton><MenuIcon/></IconButton>;
    var title = "Let's get shit done!"
    var rightIcon=<IconButton><StatusIcon/></IconButton>; 

    if(this.state.currentPage === "Feed")
    {
        title = "Your commitments";
        content =<Feed onNewCommit={this.onNewCommit} onResolve={this.onResolve} />;
        //leftIcon = <IconButton><MenuIcon/></IconButton>; 
        leftIcon = <IconButton></IconButton>; 
        rightIcon = <IconButton><StatusIcon/></IconButton>; 

    }
    else if (this.state.currentPage === "Creator")
    {
        title = "New commitment";
        content =<Creator onCommitmentCreated = {this.onCommitmentCreated} />;
        leftIcon = <IconButton><BackIcon/></IconButton>;
    }

    else if (this.state.currentPage === "Resolver")
    {
        title = "Resolve commitment";
        content =<Resolver onResolved = {this.onResolved} commitmentId={this.state.commitmentIdToResolve}/>;
        leftIcon = <IconButton><BackIcon/></IconButton>;
    }

    var actions = [
        <FlatButton
            label="Got it"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.closeDialog}
        />
    ];

    return (

      <div className="App">
        <MuiThemeProvider>
            <div>

                <Dialog
                    title="Let's get it done!   "
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.closeDialog}>

                    <StatusContent/>

                </Dialog>

                <AppBar title={title}
                    onLeftIconButtonTouchTap = {this.onLeftIconTap}
                    iconElementLeft={leftIcon}
                    onRightIconButtonTouchTap = {this.onRightIconTap}
                    iconElementRight={rightIcon}/>

                <div style = {{padding:15}}>
                    {content}

                </div>

                <Snackbar
                    open={this.state.notificationOpen}
                    message={this.state.notificationMessage}
                    autoHideDuration={5000}
                    onRequestClose={this.onNotificationClosed}
                />

            </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
