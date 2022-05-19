import React, { Component } from 'react';
import Bank from '../../ethereum/bank';
import { Form, Button, Input, Container, Message, Card, Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import getToken from "../../ethereum/token";
import Head from 'next/head';
import Header from '../../components/Header';
import '../../fireBaseConfig'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'


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
    async componentDidMount() {
        try {
            const etherBal = await Bank.methods.balance().call({ from: this.props.address })
            const token = getToken("0x16e5f5724C6344c60Fc4eBF24B4DabbF420eDfC4")
            const tokenBal = await token.methods.getSummary().call({ from: this.props.address })
            const token1 = getToken("0xe319111d97A16709a5260A6b14d5f9Ae2A17B4A6")
            const tokenBal1 = await token1.methods.getSummary().call({ from: this.props.address })
            const token2 = getToken("0xf65bB56631ba31AA2DE81cFe834d7c3F76c594CE")
            const tokenBal2 = await token2.methods.getSummary().call({ from: this.props.address })
            const items = [
                {
                    header: web3.utils.fromWei(etherBal, 'ether'),
                    meta: 'Your balance',
                    description: 'The Amount of Ether Available in Your Account',
                    imageUrl: 'ethlogo.png'
                },
                {
                    header: tokenBal[0],
                    meta: tokenBal[1],
                    description: tokenBal[2],
                    imageUrl: 'logo1.png'
                },
                {
                    header: tokenBal1[0],
                    meta: tokenBal1[1],
                    description: tokenBal1[2],
                    imageUrl: 'logo2.png'
                },
                {
                    header: tokenBal2[0],
                    meta: tokenBal2[1],
                    description: tokenBal2[2],
                    imageUrl: 'logo3.jpg'
                }
            ]
            this.setState({ etherBal: etherBal, tokenBal: tokenBal[0], totalSupply: tokenBal[1], items: items })
        } catch (error) {
        }

    }


    renderTransactions() {
        return <Grid>
            <Grid.Row>
                {
                    this.state.items.map((item, index) => {
                        return (
                            <Grid.Column key = {index} width = "4">
                                <Card
                                    image={`/${item.imageUrl}`}
                                    header={item.header}
                                    meta={item.meta}
                                    description={item.description}
                                />
                            </Grid.Column>
                        )
                    })
                }
            </Grid.Row>
        </Grid>
    }


    render() {
        return <div style={{ backgroundColor: 'whitesmoke' }}>
            <Head>
                <title>Dashboard</title>
                <link

                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header user={this.props.user} address={this.props.address} page='dashboard' />
            <div>
                <Container>
                    <h2 >Welcome Back!</h2>
                    <p></p>
                    <p></p>

                    {this.renderTransactions()}

                    
                </Container>

            </div>
            <h1 style={{ margin: '65px 0' }}></h1>

        </div>;
    }

}

export default BankShow;