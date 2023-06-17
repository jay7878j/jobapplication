import './index.css'
import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = () => {
  console.log('jay')

  return (
    <>
      <Header />
      <div className="mainHomeContainer">
        <div className="homeContentContainer">
          <h1 className="mainHomeHeading">find the job that fits your life</h1>
          <p className="homePara">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="logoutBtn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
