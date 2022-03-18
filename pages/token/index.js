import { Component, useEffect } from "react";
import getToken from "../../ethereum/token";
import {Form, Button, Input, Container, Message} from "semantic-ui-react";
import web3 from "../../ethereum/web3";


export default class Token extends Component{
    state = {
        amountOfTokens: '',
        errorMessage: '',
        tokenContract: null
    }
    componentDidMount(){
        this.getTok()
    }
     getTok = async ()  => {
        const token = getToken("0x56357B12b8A54C4312998A40541EE3Bcc4092a09")
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
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    };
    render(){
        return (
            <Container>
                <link
                        async
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />

                <Form onSubmit={this.onClick} error={!!this.state.errorMessage}>
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
                        <Button primary>Mint</Button>
                    </Form>

            </Container>
        )
    
    }

}