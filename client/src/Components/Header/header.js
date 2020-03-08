import React, { Component } from 'react';
import './Freindship.css';

class Freindship extends Component {
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
        fetch('/freindship/unfollow/'+uid_to_unfollow,
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
                  var personinfo = this.state.followings_detailed[uid_to_unfollow]
                  delete this.state.followings_detailed[uid_to_unfollow]
                  this.setState({message: "Unfollowed: "+personinfo.full_name, followings_detailed: this.state.followings_detailed})
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
        a.push(<a>{i}. {this.state.followings_detailed[uid].full_name} - {this.state.followings_detailed[uid].username}
           <br /></a>)
        i++
      }
      return(

        <div class="ffwrapper">
            <div class="followengine">
            <div class="nav-card">
              <h2>Freindship Activity</h2>
            </div>
                <div class="folldiv">
                    <div class="ffavatardiv">
                        <div class="ffavatarwrap">
                            <div class="ffavatar" role="button" tabindex="0">
                                    <img alt="ines_achour_09's profile picture" class="ffpicavatar" src="https://instagram.ftun11-1.fna.fbcdn.net/v/t51.2885-19/s150x150/61801585_498936527312874_1008426194745425920_n.jpg?_nc_ht=instagram.ftun11-1.fna.fbcdn.net&amp;_nc_ohc=6hUdEjsW28YAX8LkT7s&amp;oh=3f0515253ee278698ac7643aadec562c&amp;oe=5E871F13" />
                            </div>
                        </div>
                    </div>
                    <div class="fftext">
                        follow.
                        <div class="ffname">
                            <a class="namelink notranslate  ffnamelink" title="ines_achour_09" href="/ines_achour_09/">ines_achour_09</a>
                        </div>
    
                        <time class="ffaction fftime" datetime="2020-01-01T14:33:43.045Z" title="Jan 1, 2020">8w</time>
                    </div>
                </div>
            
                <div class="folldiv">
                    <div class="ffavatardiv">
                        <div class="ffavatarwrap">
                            <div class="RR-M-" role="button" tabindex="0">
                                    <img alt="ines_achour_09's profile picture" class="ffpicavatar" src="https://instagram.ftun11-1.fna.fbcdn.net/v/t51.2885-19/s150x150/61801585_498936527312874_1008426194745425920_n.jpg?_nc_ht=instagram.ftun11-1.fna.fbcdn.net&amp;_nc_ohc=6hUdEjsW28YAX8LkT7s&amp;oh=3f0515253ee278698ac7643aadec562c&amp;oe=5E871F13"/>
                            </div>
                        </div>
                    </div>
                    <div class="fftext">
                        <div class="ffname">
                            <a class="namelink notranslate  ffnamelink" title="ines_achour_09" href="/ines_achour_09/">ines_achour_09</a>
                        </div>
                            action started following.
                        <time class="ffaction fftime" datetime="2020-01-01T14:33:43.045Z" title="Jan 1, 2020">8w</time>
                    </div>
                </div>
            </div>
        </div>


//        <div style={{overflow:'scroll', height:'400px'}}>
//          <a>{this.state.message}<br /></a>
//          { Object.keys(this.state.followings_detailed).length == 0 ? "" : 
//            <a href='' onClick={this.handleClick} >Remove All Followings <br /></a>
//          }
//          {this.state.is_loading ? "Loading..." : a }
//        </div>
      )
    }
  }

export default Freindship;