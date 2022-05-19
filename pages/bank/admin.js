import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Button, Checkbox, Icon, Table, Form, Input, Message, Container } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import Head from 'next/head';
import { Router } from '../../routs';
import Header from '../../components/Header';
import getToken from "../../ethereum/token";
import '../../fireBaseConfig'


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
        
        return { pendingCustomers };
    }

    state = {
        address: '',
        amountOfTokens: '',
        errorMessage: '',
        tokenContract: null,
        selectedCustomers: [],
        loading: false,
        start: false,
        checking: false,
        tokens: [{ tokenName: 'GAZE', tokenAddress: '0x16e5f5724C6344c60Fc4eBF24B4DabbF420eDfC4' },
        { tokenName: 'BAZE', tokenAddress: '0xe319111d97A16709a5260A6b14d5f9Ae2A17B4A6' },
        { tokenName: 'FAZE', tokenAddress: '0xf65bB56631ba31AA2DE81cFe834d7c3F76c594CE' }],
        selectedToken: ''
    }

    componentDidMount() {
        this.getTok()
    }
    getTok = async (selectedToken) => {
        const token = getToken(selectedToken)
        this.setState({
            ...this.state,
            tokenContract: token
        })

    }

    onClick = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });


        try {
            const accounts = await web3.eth.getAccounts();
            await this.state.tokenContract.methods.mint(accounts[0], this.state.amountOfTokens).send({
                from: accounts[0]
            });
            Router.pushRoute(`/bank/admin`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };
    acceptCustomer = async () => {
        this.setState({ checking: true });

        try {
            const accounts = await web3.eth.getAccounts()
            for (let j = 0; j < this.state.selectedCustomers.length; j++) {
                await Bank.methods.acceptCustomers(this.state.selectedCustomers[j].address, this.state.selectedCustomers[j].id).send({ from: accounts[0] });
            }
            Router.pushRoute(`/bank/admin`);
        } catch (error) {
        }
        this.setState({ checking: false });
    }

    acceptAllCustomers = async (event) => {
        event.preventDefault();
        this.setState({ start: true });


        try {
            const accounts = await web3.eth.getAccounts()
            for (let i = 0; i < this.props.pendingCustomers.length; i++) {
                await Bank.methods.acceptCustomers(this.props.pendingCustomers[i].address, this.props.pendingCustomers[i].key).send({ from: accounts[0] });
            }
            Router.pushRoute(`/bank/admin`);
        } catch (error) {
    
        }
        this.setState({ start: false });
    };

    renderPendingCustomers() {
        return this.props.pendingCustomers.map((cus, i) => (
            <Table.Row key={i}>
                <Table.Cell collapsing>
                    <Checkbox slider onChange={() => {
                        const updatedSelectedCustomers = [...this.state.selectedCustomers]
                        const index = this.state.selectedCustomers.findIndex((cus) => cus.id === i);
                        if (index >= 0) {
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
        return (
            <div style={{ backgroundColor: 'whitesmoke' }}>

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
                                    <Button loading={this.state.checking} secondary size='small' onClick={this.acceptCustomer}>Approve</Button>
                                    <Button loading={this.state.start} secondary onClick={this.acceptAllCustomers} size='small'>
                                        Approve All
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>

                    <Form onSubmit={this.onClick} error={!!this.state.errorMessage}>
                        <div>
                            <Input list='tokens' placeholder='Choose Token...' onChange={(e) => {
                                this.getTok(e.target.value)
                            }}/>
                            <datalist id='tokens'>
                                {
                                    this.state.tokens.map((token, index) => (<option key={index} value={token.tokenAddress}>{token.tokenName}</option>))
                                }

                            </datalist>
                        </div>
                        <Form.Field>
                            <label>mint Tokens</label>
                            <Input
                                label="amount"
                                labelPosition="right"
                                value={this.state.amountOfTokens}
                                onChange={event => this.setState({ amountOfTokens: event.target.value })}
                            />
                        </Form.Field>

                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Button loading={this.state.loading} secondary>Mint</Button>
                    </Form>
                </Container>
                <h1 style={{ margin: '400px 0' }}></h1>
            </div>
        );
    }
}
export default admin;