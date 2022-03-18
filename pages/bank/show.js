import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Form, Button, Input, Container, Message, Card } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import getToken from "../../ethereum/token";
import classes from "../../public/css/oboi.module.css";
import Head from 'next/head';
import { Link, Router } from '../../routs';
import Header from '../../components/Header';


class BankShow extends Component {
    state = {
        etherBal: '',
        tokenBal: '',
        totalSupply: '',
        address: "",
        items: [],
        Amount: '',
        errorMessage: '',
        message: '',
        value: '',
        errorMessage1: '',
        num: '',
        place: '',
        loading: false,
        start: false,
        chill: false,
        error: '',
    
    }
    static async getInitialProps(props) {
        console.log(props.query.address);
        return {
            address: props.query.address
        }
    }
    async componentDidMount() {
        try {
            const etherBal = await Bank.methods.balance().call({ from: this.props.address })
            const token = getToken("0xf5e6d0e7b57a5ffC2EAF0C229b0E6E1081c8cdE1")
            const tokenBal = await token.methods.getSummary().call({ from: this.props.address })
            console.log(tokenBal)
            const items = [
                {
                    header: web3.utils.fromWei(etherBal, 'ether'),
                    meta: 'Your balance',
                    description: 'The Amount of Ether Available in Your Account'
                },
                {
                    header: tokenBal[0],
                    meta: 'Your Token Balance',
                    description: 'The Amount of Tokens Available in your Account'
                },
                {
                    header: tokenBal[1],
                    meta: 'Token Total Supply',
                    description: 'The Amount of Tokens Available in the contract'
                }
            ]
            this.setState({ etherBal: etherBal, tokenBal: tokenBal[0], totalSupply: tokenBal[1], items: items })
        } catch (error) {

        }

    }

    withdraw = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        try {
            const accounts = await web3.eth.getAccounts();

        
            this.setState({ message: "Waiting on transaction success..." });
            await Bank.methods.withDraw(web3.utils.toWei(this.state.value, 'ether')).send({
            from: accounts[0]
            });

            Router.pushRoute(`/bank/${accounts[0]}`);

        } catch (err) {

            this.setState({ errorMessage1: err.message });
    
        }
        this.setState({ loading: false });
    };

    Transfer = async (event) => {
        event.preventDefault();
        this.setState({ start: true });

        try {
            const accounts = await web3.eth.getAccounts();
            const token = getToken("0xf5e6d0e7b57a5ffC2EAF0C229b0E6E1081c8cdE1");
            console.log(token)

        
            await token.methods.transfer(this.state.place,this.state.Amount).send({
            from: this.props.address
            });
            Router.pushRoute(`/bank/${accounts[0]}`);

        } catch (err) {

            this.setState({ errorMessage: err.message });
    
        }
        this.setState({ start: true });
    };

    Deposit = async (event) => {
        event.preventDefault();
        this.setState({ chill: true });

        try {
            const accounts = await web3.eth.getAccounts();

            // console.log(web3.utils.toWei(this.state.Amount, 'ether'))
        
            this.setState({ message: "Waiting on transaction success..." });
            // console.log(accounts[0], this.state.Amount)
            await Bank.methods.deposit().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.num, 'ether')
            });
            Router.pushRoute(`/bank/${accounts[0]}`);

            this.setState({ message: "Account Has Been Created" });

        } catch (err) {

            this.setState({ error: err.message });
    
        }
        this.setState({ chill: true });
    };



    renderTransactions() {


        return <Card.Group items={this.state.items} />;
    }


    render() {
        return <div className={classes.image} >
            <Head>
                <link

                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header address={this.state.address} />
            <div>
            <Container>
            <h3 style = {{color: 'white'}}>Transactions Area</h3>
                <p></p>
                <p></p>
                
                {this.renderTransactions()}
                
                <Form onSubmit={this.withdraw} style = {{margin: '60px 0'}} error={!!this.state.errorMessage1}>
                            <Form.Field>
                                <label style = {{color: 'white'}}>The Amount you Want to withdraw</label>
                                <Input 
                                label="amaount" 
                                labelPosition="right"
                                style = {{width: '20%'}} 
                                value={this.state.value}
                                onChange={event => this.setState({ value: event.target.value })}
                                />
                            </Form.Field>
                            
                            <Message error header="Oops!" content={this.state.errorMessage1} />
                            <Button loading={this.state.loading} secondary>Withdraw</Button>
                        </Form>

                        <Form onSubmit={this.Transfer} style={{ marginTop: '60px 0' }} error={!!this.state.errorMessage}>
                            <Form.Field>
                                <label style = {{color: 'white'}}>The Amount of Tokens to Transfer</label>
                                <Input 
                                label="amount" 
                                labelPosition="right"
                                style = {{width: '20%'}} 
                                value={this.state.Amount}
                                onChange={event => this.setState({ Amount: event.target.value })}
                                />
                                <label style = {{color: 'white'}}>The Address of the recipient</label>
                                <Input 
                                label="address" 
                                labelPosition="right"
                                style = {{width: '20%'}} 
                                value={this.state.place}
                                onChange={event => this.setState({ place: event.target.value })}
                                />
                            </Form.Field>
                            
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button loading={this.state.start} secondary>transfer</Button>
                        </Form>

                        <Form onSubmit={this.Deposit} style = {{margin: '60px 0'}} error={!!this.state.error}>
                            <Form.Field>
                                <label style = {{color: 'white'}}>Amount To Deposit</label>
                                <Input 
                                label="Amount" 
                                labelPosition="right"
                                style = {{width: '20%'}} 
                                value={this.state.num}
                                onChange={event => {
                                    // console.log(event.target.value)
                                    this.setState({ num: event.target.value })
                                }}
                                />
                            </Form.Field>
                            
                            <Message error header="Oops!" content={this.state.error} />
                            <Button loading={this.state.chill} secondary>Deposit</Button>
                        </Form>
                </Container>        

            </div>
            <h1 style={{margin: '65px 0'}}></h1>

        </div>;
    }

}

export default BankShow;