import React, { Component } from 'react'
import Head from 'next/head'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, getFirestore, collection, query, getDocs, where } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import '../../fireBaseConfig'
import { Router } from '../../routs'


class LoginForm extends Component {
    state = {
        email: '',
        password: '',
        loading: false,
        errorMessage: '',
        success: false
    }

    loginUser = async (e) => {
        try {
            e.preventDefault()
            this.setState({ loading: true })
            const user = await signInWithEmailAndPassword(getAuth(), this.state.email, this.state.password)
            const customerCollection = collection(getFirestore(getApp()), 'customers')
            const customerQuery = query(customerCollection, where('ID', '==', user.user.uid))
            const fetchedDoc = await getDocs(customerQuery)
            if (fetchedDoc.empty) {
                throw new Error('User does not exist')
            }
            let userData = []
            fetchedDoc.forEach(d => {
                userData.push({
                    id: d.data().ID,
                    address: d.data().address,
                    email: d.data().email
                })
            })
            this.setState({ loading: false, errorMessage: 'Operation Success', success: true })
            Router.pushRoute(`/bank/${userData[0].address}`)
        } catch (err) {
            this.setState({ errorMessage: err.message, loading: false })
        }

    }
    render() {
        return (
            <div>
                <Head>
                    <title>Log-in</title>
                    <link
                        async
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                    />
                </Head>

                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' content='Log-in to your account' textAlign='center' />


                        <Form size='large' onSubmit={this.loginUser} error = {!!this.state.errorMessage}>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' 
                                value={this.state.email} onChange={e => this.setState({email: e.target.value})} />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    value = {this.state.password}
                                    onChange={e => this.setState({password: e.target.value})}
                                />

                                <Button loading = {this.state.loading} color='blue' fluid size='large'>
                                    Login
                                </Button>
                            </Segment>
                            <Message success= {this.state.success} content= {this.state.errorMessage} error header= 'Alert' />
                        </Form>
                        <div style={{ margin: '20px 0' }}>
                            <h3>New to us? </h3><a href='/bank#open'>Sign Up</a>
                        </div>

                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}





export default LoginForm