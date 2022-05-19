import React from 'react';
import { Input, Menu, MenuMenu, Segment } from 'semantic-ui-react'
import { Link, Router } from '../routs';
import web3 from "../ethereum/web3";
export default function (props) {
    
    return (
        <Segment inverted>
        <Menu inverted secondary pointing>
            <Menu.Item>Coin-Space</Menu.Item>
            {props.user && <Menu.Menu position='right'>
                <Link route={`/bank/${props.address}`}>
                    <a className ={`item ${props.page === 'dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </a>
                </Link>
                <Link route={`/bank/${props.address}/withdraw`} >
                    <a className ={`item ${props.page === 'withdraw' ? 'active' : ''}`} >
                        Withdraw
                    </a>
                </Link>

                <Link route={`/bank/${props.address}/transfer`} >
                    <a className ={`item ${props.page === 'transfer' ? 'active' : ''}`}>
                        Transfer
                    </a>
                </Link>

                <Link route={`/bank/${props.address}/deposit`} >
                    <a className ={`item ${props.page === 'deposit' ? 'active' : ''}`}>
                        Deposit
                    </a>
                </Link>
            </Menu.Menu>}

        </Menu>
        </Segment>
    );
};

