import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Button, Checkbox, Icon, Table, Form, Input, Message, Container } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import classes from "../../public/css/oboi.module.css";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';
import getToken from "../../ethereum/token";


class admin extends Component {

    static async getInitialProps() {
        const numberofcustomers = await Bank.methods.numberOfCustomers().call();
        const pendingCustomers = []

        for (let i = 0; i <= numberofcustomers; i++) {
            const pendingCustomer = await Bank.methods.pendingCustomers(i).call()
            if (pendingCustomer === '0x0000000000000000000000000000000000000000') {
                continue
            }
            pendingCustomers.push({
                key: i,
                address: pendingCustomer
            })
        }
        console.log(pendingCustomers)
        return { pendingCustomers };
    }

    state = {
        address: '',
        amountOfTokens: '',
        errorMessage: '',
        tokenContract: null,
        selectedCustomers: []
    }

    componentDidMount(){
        this.getTok()
    }
     getTok = async ()  => {
        const token = getToken("0xf5e6d0e7b57a5ffC2EAF0C229b0E6E1081c8cdE1")
        console.log(token)
        this.setState({
            ...this.state,
            tokenContract: token
        })

    }

    onClick = async (event) => {
        event.preventDefault();

        try {
            const accounts = await web3.eth.getAccounts();
            await this.state.tokenContract.methods.mint(accounts[0],this.state.amountOfTokens).send({
                from: accounts[0]
            });
            Router.pushRoute(`/bank/admin`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    };
    acceptCustomer = async () => {
        try {
            const accounts = await web3.eth.getAccounts()
            for  (let j = 0;  j < this.state.selectedCustomers.length; j++){
                await Bank.methods.acceptCustomers(this.state.selectedCustomers[j].address, this.state.selectedCustomers[j].id).send({from: accounts[0]});
            }
            Router.pushRoute(`/bank/admin`);
        } catch (error) {
            console.log(error.message)
        }
    }

    acceptAllCustomers = async (event) => {
        event.preventDefault();

        try {
            const accounts = await web3.eth.getAccounts()
            for (let i = 0; i < this.props.pendingCustomers.length; i++){
                await Bank.methods.acceptCustomers(this.props.pendingCustomers[i].address, this.props.pendingCustomers[i].key).send({from: accounts[0]});
            }
            Router.pushRoute(`/bank/admin`);
        } catch (error) {
            console.log(error.message)
        }
    };

    renderPendingCustomers() {
        return this.props.pendingCustomers.map((cus, i) => (
            <Table.Row key = {i}>
                <Table.Cell collapsing>
                    <Checkbox slider onChange={() => {
                        const updatedSelectedCustomers = [...this.state.selectedCustomers]
                        const index = this.state.selectedCustomers.findIndex((cus) => cus.id === i);
                        if (index >= 0){
                            updatedSelectedCustomers.splice(index, 1)
                            this.setState({
                                ...this.state,
                                selectedCustomers: updatedSelectedCustomers
                            })
                            return
                        }
                        updatedSelectedCustomers.push({
                            id: cus.key,
                            address: cus.address
                        })
                        this.setState({
                            ...this.state,
                            selectedCustomers: updatedSelectedCustomers
                        })

                    }} />
                </Table.Cell>
                <Table.Cell>{i}</Table.Cell>
                <Table.Cell>{cus.address}</Table.Cell>
            </Table.Row>
        ))
    }

    render() {
        console.log(this.state.selectedCustomers)
        return (
            <div className={classes.image}>

                <Head>
                    <link
                        async
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                </Head>
                <Header address={this.state.address} />
                <Container>
                <Table compact celled definition>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell>S/N</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {this.renderPendingCustomers()}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan='4'>
                                <Button secondary size='small' onClick={this.acceptCustomer}>Approve</Button>
                                <Button secondary onClick={this.acceptAllCustomers} size='small'>
                                    Approve All
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>

                <Form onSubmit={this.onClick} error={!!this.state.errorMessage}>
                        <Form.Field>
                            <label style={{color: 'white'}}>mint Tokens</label>
                            <Input 
                            label="amount" 
                            labelPosition="right" 
                            value={this.state.amountOfTokens}
                            onChange={event => this.setState({ amountOfTokens: event.target.value })}
                            />
                        </Form.Field>
                        
                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Button secondary>Mint</Button>
                    </Form>
                    </Container>
                    <h1 style={{ margin: '400px 0' }}></h1>
            </div>
        );
    }
}
export default admin;