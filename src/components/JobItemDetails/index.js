import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {FaBriefcase} from 'react-icons/fa'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    jobDetails: {},
    similarJobsList: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken);
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id);
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    // console.log(response);

    if (response.ok) {
      const data = await response.json()
      // console.log(data);
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
      }
      // console.log(jobDetails);
      const similarJobsList = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      // console.log(similarJobsList);
      this.setState({
        jobDetails,
        apiStatus: apiStatusConst.success,
        similarJobsList,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConst.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loaadingContainer profileContainer">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="red" height="50" width="50" />
      </div>
    </div>
  )

  renderFailureView = () => {
    console.log('fail')
    const failureImage =
      'https://assets.ccbp.in/frontend/react-js/failure-img.png'

    const onRetryAgainBtn = () => {
      this.getJobItemDetails()
    }

    return (
      <div className="failureViewContainer">
        <img className="failureImg" src={failureImage} alt="failure view" />
        <h1 className="failureViewHeading">Oops! Something Went Wrong</h1>
        <p className="failureViewPara">
          We cannot seem to find the page you are looking for.
        </p>
        <button type="button" className="retryBtn" onClick={onRetryAgainBtn}>
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = () => {
    const {jobDetails} = this.state
    console.log(jobDetails)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    const getSimilarJobContainer = () => {
      const {similarJobsList} = this.state

      return (
        <ul className="similarJobsListContainer">
          {similarJobsList.map(eachItem => (
            <list className="similarListItemEl" key={eachItem.id}>
              <div className="companylogoContainer">
                <img
                  className="companyLogo"
                  src={eachItem.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div className="jobTitleContainer">
                  <h1 className="jobTitleHeading">{eachItem.title}</h1>
                  <div className="ratingContainer">
                    <AiFillStar size="18" />
                    <p className="para ratingPara">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="descriptionHeading">Description</h1>
              <p className="jobInfoPara">{eachItem.jobDescription}</p>
              <div className="locationContainerAndEmploymentType similarJobLocation">
                <div className="locationContainer">
                  <HiLocationMarker size="18" />
                  <p className="para">{eachItem.location}</p>
                </div>
                <div className="locationContainer">
                  <FaBriefcase size="18" />
                  <p className="para">{eachItem.employmentType}</p>
                </div>
              </div>
            </list>
          ))}
        </ul>
      )
    }

    const getSkillsContainer = skill => (
      <ul className="skillsListContainer">
        {skill.map(eachItem => (
          <li className="skillsListItemEl" key={eachItem.name}>
            <img
              src={eachItem.imageUrl}
              className="skillsLogo"
              alt={eachItem.name}
            />
            <p className="skillsPara">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )

    const getLifeAtCompanyContainer = lifeAtCompanyy => (
      <div className="lifeAtCompanyContainer">
        <p className="lifePara">{lifeAtCompanyy.description}</p>
        <img
          className="lifeAtCompanyImg"
          src={lifeAtCompanyy.imageUrl}
          alt="life at company"
        />
      </div>
    )

    return (
      <>
        <div className="jobCardListItemEl">
          <div className="companylogoContainer">
            <img
              className="companyLogo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="jobTitleContainer">
              <h1 className="jobTitleHeading">{title}</h1>
              <div className="ratingContainer">
                <AiFillStar size="18" />
                <p className="para ratingPara">{rating}</p>
              </div>
            </div>
          </div>
          <div className="locationAndPackageContainer">
            <div className="locationContainerAndEmploymentType">
              <div className="locationContainer">
                <HiLocationMarker size="18" />
                <p className="para">{location}</p>
              </div>
              <div className="locationContainer">
                <FaBriefcase size="18" />
                <p className="para">{employmentType}</p>
              </div>
            </div>
            <p className="packagePara">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="descContainer">
            <h1 className="descriptionHeading">Description</h1>
            <a
              href={companyWebsiteUrl}
              className="anchorContainer"
              target="_blank"
              rel="noreferrer"
            >
              <p className="anchorPara">Visit</p>
              <BiLinkExternal size="18" />
            </a>
          </div>
          <p className="jobInfoPara">{jobDescription}</p>
          <h1 className="heading">Skills</h1>
          {getSkillsContainer(skills)}
          <h1 className="heading">Life at Company</h1>
          {getLifeAtCompanyContainer(lifeAtCompany)}
        </div>
        <h1 className="heading">Similar Jobs</h1>
        {getSimilarJobContainer()}
      </>
    )
  }

  getRenderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.inProgress:
        return this.renderLoadingView()

      case apiStatusConst.success:
        return this.renderSuccessView()

      case apiStatusConst.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="mainJobDetailsContainer">{this.getRenderViews()}</div>
      </>
    )
  }
}

export default JobItemDetails
