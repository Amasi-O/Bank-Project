import React, {Component} from "react";
import {Form, Button, Input, Container, Message} from "semantic-ui-react";
import Bank from '../../ethereum/bank';
import web3 from "../../ethereum/web3";
import classes from "../../public/css/oboi.module.css";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';

class BankNew extends Component {
    state = {
        customeraddress: "",
        errorMessage: '',
        checking: false,
        userAddress: "",
        message: "",
        Amount: "",
        address: "",
        checkMsg: '',
        loading: false,
        start: false
    };

    checkAddress = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });


        const accounts = await web3.eth.getAccounts();

        this.setState({ message: "Please Wait..." });


        const answer = await Bank.methods.acceptedCustomers(this.state.userAddress).call();
        
    
        this.setState({ checking: answer, checkMsg: answer ? 'You have been approved' : 'You have not been approved' });
        this.setState({ loading: false });
    };

    creatEAccount = async (event) => {
        event.preventDefault();
        this.setState({ start: true });


        try {
            const accounts = await web3.eth.getAccounts()
        
            await Bank.methods.createAccount().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.Amount, 'ether')
            });

            Router.pushRoute(`/bank/${accounts[0]}`);
            // this.setState({ start: false });

        } catch (err) {

            this.setState({ errorMessage: err.message });
    
        }
        this.setState({ start: false });
    };


    render() {
        return (
            <div className={classes.image}>
                <Head> 
                    <link
                            async
                            rel="stylesheet"
                            href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                        />
                </Head>
                <Header address = {this.state.address}/>
                <Container>
                    <Form onSubmit={this.checkAddress}>
                                <Form.Field>
                                    <label  style = {{color: 'white'}}>check to see if youve been accepted</label>
                                    <Input 
                                    label="address" 
                                    labelPosition="right" 
                                    style = {{width: '40%'}}
                                    value={this.state.userAddress
                                    }
                                    onChange={event => this.setState({ userAddress: event.target.value })}
                                    />
                                </Form.Field>
                                
                    
                                <Button loading={this.state.loading} secondary>check</Button>
                            </Form>
                            {this.state.checking && <p style={{color: 'white' }}>{this.state.checkMsg}</p>} 
                    

                    <Form onSubmit={this.creatEAccount} style = {{margin: '60px 0'}} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label style = {{color: 'white'}}>Initial Deposit</label>
                                <Input 
                                label="address" 
                                labelPosition="right"
                                style = {{width: '20%'}} 
                                value={this.state.Amount}
                                onChange={event => {
                                    console.log(event.target.value)
                                    this.setState({ Amount: event.target.value })
                                }}
                                />
                            </Form.Field>
                            
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button loading={this.state.start} secondary>Create Account</Button>
                        </Form>
                    </Container>
                    <h1 style={{ margin: '275px 0'}}></h1>
            </div>
        );        
    }
}

export default BankNew;