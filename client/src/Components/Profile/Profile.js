import React, { Component } from 'react';
import './Profile.css';
import Follow from '../Freindship/Follow';
import Unfollow from '../Freindship/Unfollow';
class Profile extends Component
{
    constructor(props)
    {
      super(props)
      this.state  = {userdata : props.userdata, showFollowings: false, followings_detailed:{} ,is_loading: false,
                      message: ""}
      this.handleClick = this.handleClick.bind(this);
    }
  
    shouldComponentUpdate(nextProps,state)
    {
      this.state.userdata = nextProps.userdata
      return true
    }


    handleClick(event)
    {
      this.setState({followings_detailed:{}, is_loading:true})
      fetch('/freindship/followings',
      {
        method:'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      }).then(response => response.json())
      .then(json => {
            if(json.success)
            {
              if(json.data != null)
              {
                  var users_list = json.data["users"]
                  var followings_detailed = {}
                  var followings_name = {}
                  for(var i = 0; i < users_list.length; i++)
                  {
                    followings_detailed[users_list[i].pk] = users_list[i]
                  }
                  this.setState({followings_detailed: followings_detailed, is_loading : false,
                                  message: "Total: "+Object.keys(followings_detailed).length+" followings"})
                                  console.log(json.data.users)
              
//                this.setState({followings_detailed: followings_detailed, is_loading : false, 
//                message: "Total: "+Object.keys(followings_detailed).length+" followings"})

            }
        }
      }).catch(e =>
      {
          this.setState({is_loading:false, message: "Error getting followings"})
      })
      
      event.preventDefault()
    }
  
    render()
    {
        var users = []
        var i = 1
        for (var i in this.state.followings_detailed)
        {
            console.log(this.state.followings_detailed)
            users.push(
                    <div class="folldiv">
                        <div class="ffavatardiv">
                            <div class="ffavatarwrap">
                                <div class="RR-M-" role="button" tabindex="0">
                                    <img alt="profile picture" class="ffpicavatar" src={this.state.followings_detailed[i].profile_pic_url}/>
                                </div>
                            </div>
                        </div>
                        <div class="fftext">
                            <div class="ffname">
                                <a class="namelink notranslate  ffnamelink">{this.state.followings_detailed[i].full_name}</a>
                                <time class="ffaction fftime" datetime="2020-01-01T14:33:43.045Z" title="Jan 1, 2020"> {'Private : '+this.state.followings_detailed[i].is_private.toString()}</time>
                            </div>
                                Started Following you.
                        </div>
                    </div>
             )
          i++
        }
        return(

    <div class="wrapper3">
        <div class="wrapper2">
            <div class="profile-card js-profile-card">
                <div class="profile-card__img">
                    <img class="profile-avatar-pic" src={this.state.userdata.profile_pic} alt="profile card" />
                </div>
                <div class="profile-card__cnt js-profile-cnt">
                    <div class="profile-card__name">{this.state.userdata.fullname}</div>
                    <div class="profile-card__txt">{this.state.userdata.username}</div>
                    <hr></hr>
                    <div class="profile-card-inf">
                        <div class="profile-card-inf__item">
                            <div class="profile-card-inf__title">215</div>
                            <div class="profile-card-inf__txt">Posts</div>
                        </div>
                        <div class="profile-card-inf__item">
                            <div class="profile-card-inf__title">89K</div>
                            <div class="profile-card-inf__txt">Followers</div>
                        </div>
                        <div class="profile-card-inf__item">
                            <div class="profile-card-inf__title">190</div>
                            <div class="profile-card-inf__txt">Following</div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="ffwrapper3">
                <div class="followengine" style={{overflow:'scroll', height:'400px'}}>
                    <div class="nav-card">
                        <h2>Unfollow Activity</h2>
                    </div>
                    <Follow
                    message="" followings_detailed={this.state.followings_detailed} is_loading={this.state.is_loading }
                    />
                </div>
            </div>
            <br />
        </div>
            <div class="ffwrapper">
                <div class="followengine" style={{overflow:'scroll', height:'400px'}}>
                    <div class="nav-card">
                        <h2>Freindship Activity</h2>
                        <a class="btn-getted" href="" onClick={this.handleClick}> Get followings </a>
                    </div>
                   {users}
                </div>
            </div>
        



        </div>

        );
    }
}

export default Profile;