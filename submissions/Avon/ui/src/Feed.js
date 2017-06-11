import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EthereumBridge from './EthereumBridge';
import CommitCard from './CommitCard';
import Notifier from './Notifier';

const FloatingButtonStyle = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
    zIndex:100
};

class Feed extends React.Component
{
    constructor()
    {
        super();
        Notifier.addReloadListener(this.loadData);
        EthereumBridge.onContractLoaded().then(this.loadData);
 
        this.state = {"commitments" : [],"statusText":"Checking network..."};
    }

    onResolve = (commitmentId) =>
    {
        this.props.onResolve(commitmentId);
    }

    onNewCommit = () =>
    {
        this.props.onNewCommit();
    }

    loadData = () =>
    {
        var that = this;
        EthereumBridge.getNumberOfCommitments().then(function(number){
            if(number===0)
            {
                that.setState({
                    statusText: "Nothing here yet...\n ",  
                });
            }
            else
            {
                EthereumBridge.getAllCommitmentsData(number).then(function(commitments)
                {

                    commitments.sort(function(a,b){return(b.commitmentId-a.commitmentId)});

                    that.setState({
                        commitments: commitments, 
                        statusText: "",  
                    });
                })
            }
            
        })
    }
  
  render()
  {

    var commitments = [];
    for (var i =0; i<this.state.commitments.length; i++)
    {
        commitments.push( <CommitCard key= {this.state.commitments[i].commitmentId} data = {this.state.commitments[i]} onResolve = {this.onResolve}/>);
    }

    return (
      <div>

        <p style ={{'textAlign':'center', 'color':'0#666666'}}>
            {this.state.statusText}
        </p> 

        <FloatingActionButton onTouchTap= {this.onNewCommit} secondary={true} style= {FloatingButtonStyle}>
            <ContentAdd />
        </FloatingActionButton>

        <div>
            {commitments}
        </div>      
      </div>
    );
  }
}

export default Feed;