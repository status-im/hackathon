import React from 'react';
import EthereumBridge from './EthereumBridge';

const addressStyle =
{
    color: 'rgb(153, 153, 153)',
    fontSize: '0.85em'
}

class StatusContent extends React.Component {

    constructor(props) {
        super();


        this.state = {
            'connected': EthereumBridge.isConnectedToEtherumNode().toString(),
            'provider':EthereumBridge.getProviderString()
        };
    }

    render()
    {
        return (          
            <div>

                <p style={addressStyle}>
                    This Đapp was developed by Xavi Vives as part of the Status hackathon.   
                </p>
                <p style={addressStyle}>  
                    Looking for opportunities
                </p>

                <p>  
                    http://xavivives.com/index
                </p> 
                <p>  
                    
                </p> 
                <p style={addressStyle}>
                    Connected : {this.state.connected}
                </p>


            </div>
                    
        );
    }
}

export default StatusContent;