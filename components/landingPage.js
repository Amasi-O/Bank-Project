import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React from 'react'
import DesktopContainer from './another1'

const { MediaContextProvider} = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })

const ResponsiveContainer = ({ children, gotoForm }) => (
    /* Heads up!
     * For large applications it may not be best option to put all page into these containers at
     * they will be rendered twice for SSR.
     */
    <MediaContextProvider>
        <DesktopContainer gotoForm = {gotoForm}>{children}</DesktopContainer>
    </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
    children: PropTypes.node,
}

export default ResponsiveContainer

