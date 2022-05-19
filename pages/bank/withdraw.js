import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Form, Button, Input, Container, Message, Card } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';
import '../../fireBaseConfig'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

class withdraw extends Component {
    state = {
        loading: false,
        value: '',
        errorMessage1: '',
        success: false,
        user: null
    }

    static async getInitialProps(props) {
        const app = getApp()
        const auth = getAuth(app)
        return {
            address: props.query.address,
            user: auth.currentUser ? auth.currentUser : null
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

            this.setState({success: true, errorMessage1: 'Operation success'})

            Router.pushRoute(`/bank/${accounts[0]}`);

        } catch (err) {

            this.setState({ errorMessage1: err.message });

        }
        this.setState({ loading: false });
    };

    render() {
        return <div style={{ backgroundColor: 'whitesmoke' }}>
            <Head>
                <title>Withdraw</title>
                <link

                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header user={this.props.user} address={this.props.address} page = 'withdraw' />

            <Container>
                <div style={{ backgroundColor: 'white', padding: '20px', margin: '50px auto', width: '90%', maxWidth: '40rem' }}>
                    <h2>Withdraw</h2>
                    <Form onSubmit={this.withdraw} error={!!this.state.errorMessage1}>
                        <Form.Field>
                            <label >The Amount you Want to withdraw</label>
                            <Input
                                label="amount"
                                labelPosition="right"
                                style={{ width: '80%', margin: '20px 0' }}
                                value={this.state.value}
                                onChange={event => this.setState({ value: event.target.value })}
                            />
                        </Form.Field>


                        <Message style={{ width: '50%' }} success = {this.state.success} error header="Alert" content={this.state.errorMessage1} />
                        <Button loading={this.state.loading} secondary>Withdraw</Button>
                    </Form>
                </div>
                    <h1></h1>
            </Container>

        </div>
    }

}
export default withdraw;