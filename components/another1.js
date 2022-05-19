import PropTypes from 'prop-types'
import { createMedia } from '@artsy/fresnel'
import React, { Component } from 'react'
import HomepageHeading from './HomepageHeading'
import {
    Button,
    Container,
    Menu,
    Segment,
    Visibility,
} from 'semantic-ui-react'
import { Router } from '../routs';

const { Media} = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })

class DesktopContainer extends Component {
    state = {}

    hideFixedMenu = () => this.setState({ fixed: false })
    showFixedMenu = () => this.setState({ fixed: true })

    render() {
        const { children, gotoForm } = this.props
        const { fixed } = this.state

        return (
            <Media greaterThan='mobile'>
                <Visibility
                    once={false}
                    onBottomPassed={this.showFixedMenu}
                    onBottomPassedReverse={this.hideFixedMenu}
                >
                    <Segment
                        inverted
                        textAlign='center'
                        style={{ minHeight: 700, padding: '1em 0em' }}
                        vertical
                    >
                        <Menu
                            fixed={fixed ? 'top' : null}
                            inverted={!fixed}
                            pointing={!fixed}
                            secondary={!fixed}
                            size='large'
                        >
                            <Container>
                                <Menu.Item as='a' active>
                                    Home
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Button as='a' inverted={!fixed} onClick = {() => {
                                        Router.pushRoute('/bank/login');
                                    }}>
                                        Log in
                                    </Button>
                                    <Button as='a' onClick={gotoForm} inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                                        Sign Up
                                    </Button>
                                </Menu.Item>
                            </Container>
                        </Menu>
                        <HomepageHeading gotoForm={gotoForm} />
                    </Segment>
                </Visibility>

                {children}
            </Media>
        )
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.node,
}

export default DesktopContainer