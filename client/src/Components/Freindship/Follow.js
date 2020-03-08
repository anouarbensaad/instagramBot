import React, { Component } from 'react';
import './Freindship.css';

class Follow extends Component {
  constructor(props)
  {
    super(props)
     this.state  = {is_loading: this.props.is_loading, 
                    followings_detailed: this.props.followings_detailed}

      this.removeAll = this.removeAll.bind(this)
      this.handleClick = this.handleClick.bind(this)
  }

  shouldComponentUpdate(nextProps,state)
  {
    this.state.followings_detailed = nextProps.followings_detailed
    this.state.is_loading = nextProps.is_loading

    return true
  }

  removeAll(){
    //only stop when there is no followers left
    if(Object.keys(this.state.followings_detailed).length > 0)
    {
      var uid_to_unfollow = Object.keys(this.state.followings_detailed)[0]
      fetch('/freindship/unfollow?uid='+uid_to_unfollow,
        {
          method:'GET',
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          }
        }).then(response => response.json())
        .then(json => {
            console.log(json)
            if(json.success)
            {
                var personinfo = this.state.followings_detailed[uid_to_unfollow]
                delete this.state.followings_detailed[uid_to_unfollow]
                this.setState({message: " : Unfollowed",
                              fullname:personinfo.full_name,
                              followings_detailed: this.state.followings_detailed,
                              profile_pic_url:personinfo.profile_pic_url
                            })
                setTimeout(this.removeAll(), 1500) //try again in 1secs
            }
            else 
            {
                this.setState({message: "Something went wrong!!!"});
            }
        }).catch(e =>
        {
            console.log(e)
            this.setState({message: "Something went wrong!!!"});
  
        })
    } else 
    {
         this.setState({message: "You have no followings left!!!"});
    }

  }

  handleClick(event){
    event.preventDefault()

    this.removeAll()
  }

  render()
  {
    var a = []
    var i = 1
    for (var uid in this.state.followings_detailed)
    {
      a.push(
      <div class="folldiv">
        <div class="ffavatardiv">
          <div class="ffavatarwrap">
            <div class="RR-M-" role="button" tabindex="0">
              <img alt="profile picture" class="ffpicavatar" src={this.state.followings_detailed[uid].profile_pic_url}/>
            </div>
          </div>
        </div>
      <div class="fftext">
        <div class="ffname">
          <a class="namelink notranslate  ffnamelink">{this.state.followings_detailed[uid].full_name}</a>
        </div>
        {this.state.followings_detailed[uid].username}
          </div>
      </div>
      )
      i++
    }
    return(
      <div style={{overflow:'scroll', height:'400px'}}>
        <div class="unfolldiv">
        <div class="ffavatardiv">
          <div class="ffavatarwrap">
            <div class="RR-M-" role="button" tabindex="0">
              <img alt="profile picture" class="ffpicavatar" src={this.state.profile_pic_url}/>
            </div>
          </div>
        </div>
          <div class="fftext">
            <div class="ffname">
              <a class="namelink notranslate  ffnamelink">{this.state.fullname}</a>
              <time class="unfollowed" datetime="2020-01-01T14:33:43.045Z" title="Jan 1, 2020">{this.state.message}</time>
            </div>
          </div>
        </div>

        { Object.keys(this.state.followings_detailed).length == 0 ? "" : 
          <a href='' onClick={this.handleClick} >Remove All Followings <br /></a>
        }
        {this.state.is_loading ? <div class="loader"></div> : a }
      </div>
    )
  }
}

export default Follow;