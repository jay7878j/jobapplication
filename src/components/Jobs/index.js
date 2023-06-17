import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiOutlineSearch, AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {FaBriefcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'

import './index.css'
import Cookies from 'js-cookie'
import Header from '../Header'

const apiStausConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileApiStatus: apiStausConstraints.initial,
    jobsApiStatus: apiStausConstraints.initial,
    profileDetails: {},
    jobsList: [],
    searchInput: '',
    checkBoxList: [],
    radioOption: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  // Get Profile Data
  getProfileData = async () => {
    this.setState({profileApiStatus: apiStausConstraints.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(response);
    // console.log(data);

    if (response.ok) {
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails,
        profileApiStatus: apiStausConstraints.success,
      })
    } else {
      this.setState({profileApiStatus: apiStausConstraints.failure})
    }
  }

  // Get Jobs Data
  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStausConstraints.inProgress})
    const {checkBoxList, radioOption, searchInput} = this.state
    console.log(checkBoxList)
    console.log(radioOption)
    const list = checkBoxList.join()
    console.log(list)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${list}&minimum_package=${radioOption}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      // console.log(data);

      const jobsList = data.jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      // console.log(jobsList);
      this.setState({
        jobsList,
        jobsApiStatus: apiStausConstraints.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStausConstraints.failure})
    }
  }

  // Job Details Success View
  renderJobDetailsSuccessView = () => {
    const {jobsList} = this.state
    const noJobsImage =
      'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
    // console.log(jobsList.length);
    if (jobsList.length === 0) {
      return (
        <div className="noResultsContainer">
          <img className="noResultImg" src={noJobsImage} alt="no jobs" />
          <h1>No Jobs Found</h1>
          <p className="noJobsPara">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    return (
      <ul className="jobInfoCard">
        {jobsList.map(eachItem => (
          <Link to={`/jobs/${eachItem.id}`} key={eachItem.id}>
            <li className="jobCardListItemEl">
              <div className="companylogoContainer">
                <img
                  className="companyLogo"
                  src={eachItem.companyLogoUrl}
                  alt="company logo"
                />
                <div className="jobTitleContainer">
                  <h1 className="jobTitleHeading">{eachItem.title}</h1>
                  <div className="ratingContainer">
                    <AiFillStar size="18" />
                    <p className="para ratingPara">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <div className="locationAndPackageContainer">
                <div className="locationContainerAndEmploymentType">
                  <div className="locationContainer">
                    <HiLocationMarker size="18" />
                    <p className="para">{eachItem.location}</p>
                  </div>
                  <div className="locationContainer">
                    <FaBriefcase size="18" />
                    <p className="para">{eachItem.employmentType}</p>
                  </div>
                </div>
                <p className="packagePara">{eachItem.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="descriptionHeading">Description</h1>
              <p className="jobInfoPara">{eachItem.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  // Render Job Details Failure View
  renderJobDetailFailureView = () => {
    const failureImage =
      'https://assets.ccbp.in/frontend/react-js/failure-img.png'

    const onRetryAgainBtn = () => {
      this.getJobsData()
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

  // Get Job Details Render Views
  getJobDetailsRenderViews = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStausConstraints.inProgress:
        return this.renderLoadingView()
      case apiStausConstraints.success:
        return this.renderJobDetailsSuccessView()
      case apiStausConstraints.failure:
        return this.renderJobDetailFailureView()

      default:
        return null
    }
  }

  onCheckboxClick = Event => {
    const {checkBoxList} = this.state
    const userCheckBoxValue = Event.target.id
    const inputList = checkBoxList.filter(
      eachItem => eachItem === userCheckBoxValue,
    )
    if (inputList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxList: [...prevState.checkBoxList, userCheckBoxValue],
        }),
        this.getJobsData,
      )
    } else {
      const filterCheckBox = checkBoxList.filter(
        eachItem => eachItem !== userCheckBoxValue,
      )
      this.setState({checkBoxList: filterCheckBox}, this.getJobsData)
    }
  }

  onRadioClick = Event => {
    this.setState(
      {
        radioOption: Event.target.id,
      },
      this.getJobsData,
    )
  }

  // Salary Range Container
  getSalaryRangeContainer = () => (
    <ul className="filterListContainer">
      <h1 className="filterHeading">Salary Range</h1>
      {salaryRangesList.map(eachItem => (
        <li className="filterListItemEl" key={eachItem.salaryRangeId}>
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            value={eachItem.salaryRangeId}
            onChange={this.onRadioClick}
            name="employmentOption"
          />
          <label htmlFor={eachItem.salaryRangeId} className="filterLabel">
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  // Employment Type Container
  getEmploymentFiltersContainer = () => (
    <ul className="filterListContainer">
      <h1 className="filterHeading">Type of Employment</h1>
      {employmentTypesList.map(eachItem => (
        <li className="filterListItemEl" key={eachItem.employmentTypeId}>
          <input
            type="checkbox"
            value={eachItem.employmentTypeId}
            id={eachItem.employmentTypeId}
            onChange={this.onCheckboxClick}
          />
          <label htmlFor={eachItem.employmentTypeId} className="filterLabel">
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  // Profile Render Failure View
  renderProfileFailureView = () => {
    const onRetryAgainBtn = () => {
      this.getProfileData()
    }

    return (
      <div className="profileFailureContainer profileContainer">
        <button type="button" onClick={onRetryAgainBtn} className="retryBtn">
          Retry
        </button>
      </div>
    )
  }

  // Profile Render Success View
  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profileContainer profileDetailsContainer">
        <img className="profileImg" src={profileImageUrl} alt="profile" />
        <h1 className="profileNameHeading">{name}</h1>
        <p className="profileBio">{shortBio}</p>
      </div>
    )
  }

  // Profile Render Loading View
  renderLoadingView = () => (
    <div className="loaadingContainer profileContainer">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="red" height="50" width="50" />
      </div>
    </div>
  )

  // Profile Render Views
  getProfileRenderViews = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStausConstraints.inProgress:
        return this.renderLoadingView()

      case apiStausConstraints.success:
        return this.renderProfileSuccessView()

      case apiStausConstraints.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  onEnterClick = Event => {
    if (Event.key === 'Enter') {
      this.getJobsData()
    }
  }

  //  Search Container
  getSearchContainer = () => {
    const {searchInput} = this.state

    const getUserSearchValue = Event => {
      this.setState({searchInput: Event.target.value})
    }

    const onSearchBtnClick = () => {
      this.setState({searchInput}, this.getJobsData)
    }

    return (
      <div className="searchBarContainer">
        <input
          type="search"
          className="searchBox"
          onChange={getUserSearchValue}
          value={searchInput}
          placeholder="Search"
          onKeyDown={this.onEnterClick}
        />
        <button
          type="button"
          className="searchIconBtn"
          onClick={onSearchBtnClick}
          data-testid="searchButton"
        >
          <AiOutlineSearch />
        </button>
      </div>
    )
  }

  //  Website Render
  render() {
    return (
      <>
        <Header />
        <div className="mainJobsContainer">
          <div className="smallSearch">{this.getSearchContainer()}</div>
          <div className="leftSection">
            {this.getProfileRenderViews()}
            <hr />
            {this.getEmploymentFiltersContainer()}
            <hr />
            {this.getSalaryRangeContainer()}
          </div>
          <div className="rightSection">
            <div className="largeSearch">{this.getSearchContainer()}</div>
            {this.getJobDetailsRenderViews()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
