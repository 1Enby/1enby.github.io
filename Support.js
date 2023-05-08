/*

      
      *******************************************************

      UPDATE 7/24/18:

      Module checkbox is gone under Javascript settings so its not working. I've added the Tabs and Tab components below.

      *******************************************************
      
  From scratch React.js Multi Tab Component. Importable into other pens or projects.
  
  The code below the comments is an example using my Multi Tab Component. The link to the module code can be found directly below this sentence.

  // Link to Tab Component Pen: https://codepen.io/TheVVaFFle/pen/JpWrWw
  // Direct js link: https://codepen.io/TheVVaFFle/pen/JpWrWw.js
  // Direct css link: https://codepen.io/TheVVaFFle/pen/JpWrWw.css

  Instructions:
  
    Setup:
      1. Go to JS settings. 
        - Set JavaScript PreProcessor to Babel.
        - Check the "Add script as a module" checkbox
        - Add the following as external resources:
            https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.development.js
            https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.development.js
      2. Go to CSS settings.
        - Add the following as an external resource:
            https://codepen.io/TheVVaFFle/pen/JpWrWw.css
      3. Add the following import to the JS section of your Pen:
          import {Tabs, Tab} from 'https://codepen.io/TheVVaFFle/pen/JpWrWw.js'
        
    Tabs Component Usage:
      - Props:
          customClass: A custom class to apply to the 'tab-wrapper' div. Ex: 'my-custom-tabs-class'
          tabHeight: The height of the tab area in 'px'. Ex: 100 or 250
          tabWidth: The width of the tab area in 'px'. Ex: 100 or 250
          backgroundColor: The background color of the tabs and tab header. Ex: '#03a9f4' or 'rgb(255,255,255)'
          accentColor: The tab header text and bar color. Ex: '#03a9f4' or 'rgb(255,255,255)'
          initialTab: Added so I could animate the preview window by switching tabs programmatically
      - Tab Components will be nested inside of your Tabs Component
    
    Tab Component Usage:
      - Props:
          customClass: A custom class to apply to this 'tab' div. Ex: 'my-custom-tab-class'
          label: The text that will be displayed for this tab option.
      - Any components placed inside of the Tab tags will be displayed in the tabs viewing area.
      - X direction overflow is set to hidden and Y direction overflow is set to auto
      
*/

//import {Tabs, Tab} from 'https://codepen.io/TheVVaFFle/pen/JpWrWw.js'

class Tabs extends React.PureComponent{
    constructor(props){
      super(props)
      this.getTabSize = this.getTabSize.bind(this)
      this.getColors = this.getColors.bind(this)
      this.getTabs = this.getTabs.bind(this)
      this.getTabOptions = this.getTabOptions.bind(this)
      this.setSelectedTab = this.setSelectedTab.bind(this)
      this.createTabOptions = this.createTabOptions.bind(this)
      this.updateTabBarStyles = this.updateTabBarStyles.bind(this)
      this.state = {
        selectedTab: 0,
        transitionDuration: 400,
        isTransitioning: false,
        tabBarStyles: {}
      }
    }
    componentDidMount(){
      const {selectedTab, transitionDuration} = this.state
      const tabWidth = this.getTabSize().width,
            options = this.getTabOptions(),
            tabOptionWidth = tabWidth / options.length,
            left = `${tabOptionWidth * selectedTab}px`,
            right = `${tabWidth - (tabOptionWidth * (selectedTab + 1))}px`,
            transition = `left ${transitionDuration}ms, right ${transitionDuration}ms, width ${transitionDuration / 2}ms`,
            accentColor = this.getColors().accent
      this.updateTabBarStyles(left, right, transition, accentColor)
      
      //Added later for initial animation purposes
      if(this.props.initialTab){
        setTimeout(() => this.setSelectedTab(this.props.initialTab), 250)
      }
    }
    componentDidUpdate(prevProps, prevState){
      if(prevState.selectedTab !== this.state.selectedTab){
        const {selectedTab, transitionDuration, tabBarStyles} = this.state
        const tabWidth = this.getTabSize().width,
              options = this.getTabOptions(),
              tabOptionWidth = tabWidth / options.length,
              direction = prevState.selectedTab < selectedTab ? 1 : -1,
              left = direction === -1 ? `${(tabOptionWidth * selectedTab) + (tabOptionWidth / 2)}px` : null,
              right = direction === 1 ? `${tabWidth - (tabOptionWidth * (selectedTab + 1)) + (tabOptionWidth / 2)}px` : null,
              nextLeft = `${tabOptionWidth * selectedTab}px`,
              nextRight = `${tabWidth - (tabOptionWidth * (selectedTab + 1))}px`
        this.setState({isTransitioning: true})
        this.updateTabBarStyles(left, right, null, null)
        setTimeout(() => this.updateTabBarStyles(nextLeft, nextRight, null, null), transitionDuration / 2)
        setTimeout(() => this.setState({isTransitioning: false}), transitionDuration)
      }
    }
    getTabSize(){
      const {tabHeight, tabWidth} = this.props
      return {
        height: tabHeight || 300,
        width: tabWidth || 450
      }
    }
    getColors(){
      const {accentColor, backgroundColor} = this.props
      return {
        accent: accentColor || '#03a9f4',
        background: backgroundColor || 'white'
      }
    }
    setSelectedTab(index){
      index = Math.max(0, index)
      index = Math.min(index, this.props.children.length - 1)
      this.setState({selectedTab: index})
    }
    getTabs(){
      const {children} = this.props
      const {transitionDuration} = this.state
      const tabSize = this.getTabSize(),
            moreProps = {
              width: `${tabSize.width}px`, 
              transition: `opacity ${transitionDuration * 1.5}ms, transform ${transitionDuration / 2}ms`
            }
      let tabs = !children ? new Array(<Tab key={0} label={'Default'}/>) 
            : children.length ? children : new Array(children)
      return tabs.map(tab => ({...tab, props: {...tab.props, ...moreProps}}))
    }
    getTabOptions(){
      const {children} = this.props
      let tabOptions = null
      if(!children){
        tabOptions = new Array(<Tab key={0} label={'Default'}/>)
      }
      else{
        tabOptions = children.length ? children : new Array(children)
      }
      return tabOptions.map(tab => tab.props.label)
    }
    createTabOptions(){
      const {selectedTab} = this.state
      const tabWidth = this.getTabSize().width,
            options = this.getTabOptions(),
            tabOptionWidth = tabWidth / options.length
      return options.map((tab, index) => {
        const selected = selectedTab === index,
              textStyle = selected ? {color: this.getColors().accent} : {},
              classes = `tab-option ${selected ? 'selected' : ''}`
        return(
          <div 
            key={index} 
            className={classes} 
            style={{width: `${tabOptionWidth}px`}}
            onClick={() => this.setSelectedTab(index)}
          >
            <h1 style={textStyle}>{tab}</h1>
          </div>
        )
      })
    }
    updateTabBarStyles(left, right, transition, backgroundColor){
      const {tabBarStyles} = this.state
      this.setState({
        tabBarStyles: {
          left: left || tabBarStyles.left, 
          right: right || tabBarStyles.right, 
          transition: transition || tabBarStyles.transition,
          backgroundColor: backgroundColor || tabBarStyles.backgroundColor
        }
      })
    }
    render(){
      const {customClass} = this.props
      const {tabBarStyles, selectedTab, transitionDuration, isTransitioning} = this.state
      const tabSize = this.getTabSize(),
            colors = this.getColors(),
            options = this.getTabOptions(),
            tabWrapperClasses = `tab-wrapper ${isTransitioning ? 'transitioning' : ''} ${customClass ? customClass : ''}`,
            tabWrapperStyles = {backgroundColor: colors.background, width: `${tabSize.width}px`},
            tabsStyles = {
              height: `${tabSize.height}px`,
              width: `${tabSize.width * options.length}px`, 
              transform: `translateX(${-1 * selectedTab * tabSize.width}px)`,
              transition: `transform ${transitionDuration}ms`
            },
            tabs = this.getTabs()
      
      return(
        <div className={tabWrapperClasses} style={tabWrapperStyles}>
          <div className="tab-selection">
            <div className="tab-options">
              {this.createTabOptions()}
            </div>
            <div className="tab-selection-bar-track">
              <div 
                className="tab-selection-bar" 
                style={tabBarStyles}
              />
            </div>
          </div>
          <div className="tabs" style={tabsStyles}>
            {tabs}
          </div>
        </div>
      )
    }
  }
  
  class Tab extends React.Component{
    render(){
      const {children, width, transition, customClass} = this.props
      const tabClasses = `tab ${customClass ? customClass : ''}`,
            tabStyles = {width, transition},
            tabContentStyles = {transition}
      return(
        <div className={tabClasses} style={tabStyles}>
          <div className="tab-contents" style={tabContentStyles}>
            {children}
          </div>
        </div>
      )
    }
  }
  
  class App extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        accentColor: '#03a9f4',
        backgroundColor: '#fff'
      }
    }
    getTabs(){
      return [
        {label: 'Home', icon: 'fas fa-home'},
        {label: 'Trending', icon: 'fas fa-fire'},
        {label: 'Inbox', icon: 'fas fa-inbox'},
        {label: 'Profile', icon: 'far fa-user-circle'}
      ].map((tab, index) => (
        <Tab key={index}  customClass={'my-custom-tab-class'} label={tab.label}>
          <div className="my-tab-content">
            <div className="tab-icon">
              <i className={tab.icon}/>
              <h1>The {tab.label} Tab</h1>
            </div>
          </div>
        </Tab>  
      ))
    }
    render(){
      const {accentColor, backgroundColor} = this.state
      const tabs = this.getTabs()
      
      return(
        <div id="app" style={{backgroundColor: accentColor}}>
          <div id="app-content">
            <Tabs 
              customClass={'my-custom-tab-wrapper-class'}
              tabHeight={300} 
              tabWidth={500}
              backgroundColor={backgroundColor}
              accentColor={accentColor}
              initialTab={2}
            >
              {tabs} 
            </Tabs>
          </div>
        </div>
      )
    }
  }
  
  ReactDOM.render(<App/>, document.getElementById('root'))