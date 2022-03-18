import React from 'react';
import { Input, Menu, MenuMenu } from 'semantic-ui-react'
import { Link, Router } from '../routs';
import web3 from "../ethereum/web3";
export default function (props) {
    
    return (
        <Menu secondary >
            <Menu.Item style={{ fontSize: '30px',color: 'white' }}>Bank Contract</Menu.Item>
            <Menu.Menu position='right'>
                <Link route='/bank'>
                    <a className='item' style={{ color: 'white' }}>
                        Home
                    </a>
                </Link>

                <Link route='/bank/admin'>
                    <a className='item' style={{ color: 'white' }}>
                        Admin
                    </a>
                </Link>

                <Link route={`/bank/${props.address}`}>
                    <a className='item' style={{ color: 'white' }}>
                        Customer
                    </a>
                </Link>
            </Menu.Menu>

        </Menu>
    );
};