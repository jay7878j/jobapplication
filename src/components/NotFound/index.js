import './index.css'

const NotFound = () => (
  <div className="notFoundContainer">
    <img
      className="notFoundImg"
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
    />
    <h1 className="notFoundHeading">Page Not Found</h1>
    <p className="notFoundPara">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
