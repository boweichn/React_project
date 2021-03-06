import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Highscore from './Highscore.js';
export default class GameScreen extends React.Component {
  constructor(props){
    super(props)
    var scoreObject = require('../highscore.json');
    this.state={
      winWidth: Dimensions.get('window').width,
      winHeight: Dimensions.get('window').height,
      shipImage: require('../assets/spriteAssets/ship.png'),
      blaster: require('../assets/spriteAssets/blaster.gif'),
      boom: require('../assets/spriteAssets/boom.gif'),
      initialShipY: 440,
      initialShipX: 180,
      blaster1OriginX: 0,
      blaster1OriginY: 470,
      blaster2OriginX: 25,
      blaster2OriginY: 470,
      blaster3OriginX: 50,
      blaster3OriginY: 470,
      ammoCount:3,
      showBlaster1: 'none',
      showBlaster2: 'none',
      showBlaster3: 'none',
      gameTime:120,
      reloadStatus: 'unable',
      enemyLife: 20,
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0,
      new: false,
      enemyCurrentX: '0',
      enemyCurrentY: '0',
      enemyBulletX: 0,
      enemyBulletY: 0,
      showEnemyBullet: 'none',
      show1Boom: 'none',
      show2Boom: 'none',
      show3Boom: 'none',
      showBoom: 'none',
      boomX: 0,
      boomY: 0,
      boom1X: 0,
      boom1Y: 0,
      boom2X: 0,
      boom2Y: 0,
      boom3X: 0,
      boom3Y: 0,
      playerLife: 1,
      gameState: 'inSession',
      myScoreObject: scoreObject.highscores,
      playerScore: 0
    }
    this.randomX = this.randomX.bind(this);
    this.randomY = this.randomY.bind(this);
    this.randomAnim = this.randomAnim.bind(this);
  }

  resetDirection = () => {
    this.props.direction.buttonDirection = ''
  }

  resetAB = () => {
    this.props.direction.abInputs = ''
  }

  randomX =()=>{
    let newXVal = Math.floor(Math.random() * 360) + 16;
    return newXVal;
  }

  randomY=()=>{
    let newYVal = Math.floor(Math.random() * 100) + 1;
    return newYVal;
  }

  randomAnim=()=>{
    let oldX = this.state.beginX;
    let oldY = this.state.beginY;
    let newX = this.state.endX;
    let newY = this.state.endY;
    if(this.state.new){
      this.setState({new: false})
    }
    return {0:{left: oldX, top: oldY}, 1:{left: newX, top: newY}}
  }

  onLayout = (e) => {
    this.setState({enemyCurrentX: e.nativeEvent.layout.x, enemyCurrentY: e.nativeEvent.layout.y})
  }

  resetBullets = () => {
    this.setState({
      blaster1OriginX: 0,
      blaster1OriginY: 470,
      blaster2OriginX: 25,
      blaster2OriginY: 470,
      blaster3OriginX: 50,
      blaster3OriginY: 470,
      ammoCount: 3,
      reloadStatus: 'unable',
    })
  }

  bullet1Frame = () => {
    this.b1Frame = setInterval(() => {
      if (((this.state.enemyCurrentX-15)< this.state.blaster1OriginX && this.state.blaster1OriginX < (this.state.enemyCurrentX+100))
        && this.state.enemyCurrentY< this.state.blaster1OriginY && this.state.blaster1OriginY < (this.state.enemyCurrentY+80)){
          this.bullet1Boom();
          this.setState({enemyLife: this.state.enemyLife-1, reloadStatus: 'able', showBlaster1: 'none'})
          clearInterval(this.b1Frame)
      } else if (this.state.blaster1OriginY <= 470 && this.state.blaster1OriginY >=19) {
        this.setState({showBlaster1: 'flex', blaster1OriginY: this.state.blaster1OriginY-10})
      } else if (this.state.blaster1OriginY <= 19){
        this.setState({reloadStatus: 'able', showBlaster1: 'none'})
        clearInterval(this.b1Frame)
      }
    }, 60);
  }

  bullet2Frame = () => {
    this.b2Frame = setInterval(() => {
      if (((this.state.enemyCurrentX-15)< this.state.blaster2OriginX && this.state.blaster2OriginX < (this.state.enemyCurrentX+100))
        && this.state.enemyCurrentY< this.state.blaster2OriginY && this.state.blaster2OriginY < (this.state.enemyCurrentY+80)){
          this.bullet2Boom();
          this.setState({enemyLife: this.state.enemyLife-1, showBlaster2: 'none'})
          clearInterval(this.b2Frame)
      } else if (this.state.blaster2OriginY <= 470 && this.state.blaster2OriginY >=19) {
        this.setState({showBlaster2: 'flex', blaster2OriginY: this.state.blaster2OriginY-10})
      } else if (this.state.blaster2OriginY <= 19){
        this.setState({showBlaster2: 'none'})
        clearInterval(this.b2Frame)
      }
    }, 60);
  }

  bullet3Frame = () => {
    this.b3Frame = setInterval(() => {
      if (((this.state.enemyCurrentX-15)< this.state.blaster3OriginX && this.state.blaster3OriginX < (this.state.enemyCurrentX+100))
        && this.state.enemyCurrentY< this.state.blaster3OriginY && this.state.blaster3OriginY < (this.state.enemyCurrentY+80)){
          this.bullet3Boom();
          this.setState({enemyLife: this.state.enemyLife-1, showBlaster3: 'none'})
          clearInterval(this.b3Frame)
      } else if (this.state.blaster3OriginY <= 470 && this.state.blaster3OriginY >=19) {
        this.setState({showBlaster3: 'flex', blaster3OriginY: this.state.blaster3OriginY-10})
      } else if (this.state.blaster3OriginY <= 19){
        this.setState({showBlaster3: 'none'})
        clearInterval(this.b3Frame)
      }
    }, 60);
  }
  moveShipFrame = () => {
    this.moveFrame = setInterval(() => {
      if (this.props.direction.shipStop == 'stop') {
        clearInterval(this.moveFrame)
      } if (this.props.direction.buttonDirection == 'Up' && this.state.initialShipY > 100 && this.props.direction.shipStop != 'Stop') {
        this.setState({initialShipY: this.state.initialShipY-10})
      } else if (this.props.direction.buttonDirection == 'Down' && this.state.initialShipY < 445 && this.props.direction.shipStop != 'Stop') {
        this.setState({initialShipY: this.state.initialShipY+10})
      } else if (this.props.direction.buttonDirection == 'Left' && this.state.initialShipX > 0 && this.props.direction.shipStop != 'Stop') {
        this.setState({initialShipX: this.state.initialShipX-10})
      } else if (this.props.direction.buttonDirection == 'Right' && this.state.initialShipX < 350 && this.props.direction.shipStop != 'Stop') {
        this.setState({initialShipX: this.state.initialShipX+10})
      } if (this.props.direction.shipStop == 'stop') {
        
      }
    }, 60);
  }

  bullet1Boom = () => {
    this.setState({
      boom1X:this.state.blaster1OriginX,
      boom1Y:this.state.blaster1OriginY,
      show1Boom: 'flex',
    });
    setTimeout(() => {
      this.setState({
        show1Boom: 'none',
      })
      }, 300)
  }

  bullet2Boom = () => {
    this.setState({
      boom2X:this.state.blaster2OriginX,
      boom2Y:this.state.blaster2OriginY,
      show2Boom: 'flex',
    });
    setTimeout(() => {
      this.setState({
        show2Boom: 'none',
      })
      }, 300)
  }

  bullet3Boom = () => {
    this.setState({
      boom3X:this.state.blaster3OriginX,
      boom3Y:this.state.blaster3OriginY,
      show3Boom: 'flex',
    });
    setTimeout(() => {
      this.setState({
        show3Boom: 'none',
      })
      }, 300)
  }

  bulletBoom = () => {
    this.setState({
      boomX:this.state.enemyBulletX,
      boomY:this.state.enemyBulletY,
      showBoom: 'flex',
      playerLife: this.state.playerLife-1
    });
    setTimeout(() => {
      this.setState({
        showBoom: 'none',
      })
      }, 300)
  }

  componentWillUnmount(){
    clearInterval(this.interval);
    clearInterval(this.updateInterval);
    clearInterval(this.moveFrame);
  }

  sendGSData = () => {
    dataList = 'finished'
    this.props.callbackFromParent(dataList);
  }

  componentDidMount() {
    this.aniTime = setInterval(() => {
      this.setState({gameTime: this.state.gameTime-1})
      if(this.state.gameTime == 0) {
        clearInterval(this.aniTime)
      }
    }, 1000);

    var bossBullet;
    bossBullet = setInterval(()=>{
      if(this.state.showEnemyBullet=='none'){
          this.setState({
            showEnemyBullet:'flex',
            enemyBulletX: this.state.beginX+25,
            enemyBulletY: this.state.beginY+25
          });
        
      }else if (((this.state.initialShipX-25)< this.state.enemyBulletX && this.state.enemyBulletX < (this.state.initialShipX+25))
        && (this.state.initialShipY-25)< this.state.enemyBulletY && this.state.enemyBulletY < (this.state.initialShipY+25)){
          this.setState({showEnemyBullet: 'none'})
          this.bulletBoom();
          clearInterval(this.bossBullet)
      } else if (this.state.enemyBulletY < 473) {
        this.setState({showEnemyBullet: 'flex', enemyBulletY: this.state.enemyBulletY+10})
      } else if (this.state.enemyBulletY >= 473){
        this.setState({showEnemyBullet: 'none'})
        clearInterval(this.bossBullet)
      }
    }, 50);

    this.interval = setInterval(() => {
      if(this.state.new == false){
        let orgX = this.state.endX == undefined ? 15 : this.state.endX;
          let orgY = this.state.endY == undefined ? 50 : this.state.endY;
          let destX = this.randomX();
          let destY = this.randomY();
          this.setState({
            beginX: orgX,
            beginY: orgY,
            endX: destX,
            endY: destY,
            new: true
          })
      }
    }, 999);

    this.moveFrame = setInterval(() => {
      if (this.props.direction.buttonDirection == 'Up' && this.state.initialShipY > 100 && this.props.direction.shipStop != 'Stop') {
        console.log(this.props.direction)
        this.setState({initialShipY: this.state.initialShipY-10})
      } else if (this.props.direction.buttonDirection == 'Down' && this.state.initialShipY < 445 && this.props.direction.shipStop != 'Stop') {
        console.log(this.props.direction)
        this.setState({initialShipY: this.state.initialShipY+10})
      } else if (this.props.direction.buttonDirection == 'Left' && this.state.initialShipX > 0 && this.props.direction.shipStop != 'Stop') {
        console.log(this.props.direction)
        this.setState({initialShipX: this.state.initialShipX-10})
      } else if (this.props.direction.buttonDirection == 'Right' && this.state.initialShipX < 350 && this.props.direction.shipStop != 'Stop') {
        console.log(this.props.direction)
        this.setState({initialShipX: this.state.initialShipX+10})
      }
    }, 60);
  }
  calcScore = () => {
    var score = {
      'Latest Score': (20-this.state.enemyLife) + (10*this.state.playerLife)
    } 
    if (this.state.enemyLife == 0) {
      score['Latest Score'] = score['Latest Score'] + (this.state.gameTime)
    }

    var tempObj = this.state.myScoreObject

    for (var i = 0; i < tempObj.length; i++) {
      if ('Latest Score' in tempObj[i]){
        tempObj[i]['Score'] = tempObj[i]['Latest Score']
        delete tempObj[i]['Latest Score']
      }
    }

    this.setState({myScoreObject: tempObj})
    this.setState({myScoreObject: this.state.myScoreObject.push(score), playerScore: score.score})
    return score
  }

  sortMyScoreObject = () => {
    this.setState({myScoreObject: this.state.myScoreObject.sort(function(a,b) {return (Object.values(a) < Object.values(b)) ? 1 : ((Object.values(b) < Object.values(a)) ? -1 : 0);})})
  }

  render() {
    let returnGame = () => {
      // console.log(this.state.myScoreObject[0].score)
      if (this.state.gameState == 'inSession'){
        if (this.state.enemyLife == 0 || this.state.gameTime == 0 || this.state.playerLife == 0) {
          this.sendGSData()
          this.setState({enemyLife:20, playerLife:1, gameTime:120, gameState: 'finished'})
          this.calcScore()
          this.sortMyScoreObject()
          return <Highscore />
        } else {
          return <View style={styles.gameScreen}>
            <Image source={this.state.shipImage} style={{top:this.state.initialShipY, left: this.state.initialShipX, position: 'absolute', width: 50, height: 50}}/>
            <Animatable.View onLayout={this.onLayout} style={styles.ballView} animation={this.randomAnim()} iterationCount="infinite" easing="linear" duration={1000 * 1}>
              <Animatable.Image style={styles.ballImg} source={require('../assets/spriteAssets/enemy.png')} />
            </Animatable.View>
            
            <Text style={{color: 'white', position: 'absolute', left:7, top:0}}>Ammo Count:</Text>
            <Text style={{color: 'white', position: 'absolute', left:45, top:25}}>{this.state.ammoCount}</Text>
            <Text style={{color: 'white', position: 'absolute', top:0}}>Game Time:</Text>
            <Text style={{color: 'white', position: 'absolute', top:25}}>{this.state.gameTime}</Text>
            <Text style={{color: 'white', position: 'absolute', top:0, right:25}}>Enemy Life: </Text>
            <Text style={{color: 'white', position: 'absolute', top:25, right:70}}>{this.state.enemyLife}</Text>

            {/* <Animatable.View style={{top:this.state.beginY-50, left: this.state.beginX+25, position: 'absolute', width: 50, height: 50}} animation={{0:{top: this.state.beginY}, 1:{top: 1000}}} iterationCount="infinite" easing="linear" delay={2000} duration={2000}>
              <Image source={this.state.blaster} style={{height: 50, width: 50}}/>
            </Animatable.View> */}

            <View style={{top:this.state.boomY, left: this.state.boomX, position: 'absolute', width: 50, height: 50, display: this.state.showBoom}}>
              <Image source={this.state.boom} style={{height: 50, width: 50, display: this.state.showBoom}}/>
            </View>

            <View style={{top:this.state.boom1Y, left: this.state.boom1X, position: 'absolute', width: 50, height: 50, display: this.state.show1Boom}}>
              <Image source={this.state.boom} style={{height: 50, width: 50, display: this.state.show1Boom}}/>
            </View>

            <View style={{top:this.state.boom2Y, left: this.state.boom2X, position: 'absolute', width: 50, height: 50, display: this.state.show2Boom}}>
              <Image source={this.state.boom} style={{height: 50, width: 50, display: this.state.show2Boom}}/>
            </View>

            <View style={{top:this.state.boom3Y, left: this.state.boom3X, position: 'absolute', width: 50, height: 50, display: this.state.show3Boom}}>
              <Image source={this.state.boom} style={{height: 50, width: 50, display: this.state.show3Boom}}/>
            </View>

            <View style={{top:this.state.enemyBulletY, left: this.state.enemyBulletX, position: 'absolute', width: 50, height: 50, display: this.state.showEnemyBullet}}>
              <Image source={this.state.blaster} style={{height: 50, width: 50, display: this.state.showEnemyBullet}}/>
            </View>

            <View style={{top:this.state.blaster1OriginY, left: this.state.blaster1OriginX, position: 'absolute', width: 50, height: 50, display: this.state.showBlaster1}}>
              <Image source={this.state.blaster} style={{height: 50, width: 50, display: this.state.showBlaster1}}/>
            </View>

            <View style={{top:this.state.blaster2OriginY, left: this.state.blaster2OriginX, position: 'absolute', width: 50, height: 50, display: this.state.showBlaster2}}>
              <Image source={this.state.blaster} style={{height: 50, width: 50, display: this.state.showBlaster2}}/>
            </View>

            <View style={{top:this.state.blaster3OriginY, left: this.state.blaster3OriginX, position: 'absolute', width: 50, height: 50, display: this.state.showBlaster3}}>
              <Image source={this.state.blaster} style={{height: 50, width: 50, display: this.state.showBlaster3}}/>
            </View>

            {this.shootBlaster()}
          </View>
        }
      } else {
        return <Highscore/>
      }
    }
    
    return (
      returnGame()
    );
  }

  shootBlaster = () => {
    if (this.props.direction.abInputs == 'A') {
      console.log(this.props.direction)
      if (this.state.ammoCount == 1){
        this.setState({blaster1OriginX: this.state.initialShipX, blaster1OriginY: this.state.initialShipY-15, ammoCount: this.state.ammoCount-1})
        this.bullet1Frame()
        this.resetAB()
      } else if (this.state.ammoCount == 2){
        this.setState({blaster2OriginX: this.state.initialShipX, blaster2OriginY: this.state.initialShipY-15, ammoCount: this.state.ammoCount-1})
        this.bullet2Frame()
        this.resetAB()
      } else if (this.state.ammoCount == 3){
        this.setState({blaster3OriginX: this.state.initialShipX, blaster3OriginY: this.state.initialShipY-15, ammoCount: this.state.ammoCount-1})
        this.bullet3Frame()
        this.resetAB()
      }
    } if (this.props.direction.abInputs == 'B') {
        if (this.state.reloadStatus == 'able'){
          this.resetBullets()
          this.resetAB()
        } else {
          this.resetAB()
        }
    }
  }
}

const styles = StyleSheet.create({
    gameScreen:{
        position: 'absolute',
        top: 0,
        height: '100%', width: '100%',
        backgroundColor: 'black',
        justifyContent:'center', alignItems:'center'
    },
    ballView: {
      position: 'absolute',
      width: 100,
      height: 100,
      bottom: 0,
      zIndex: 5,
    },
    ballImg: {
      position: 'absolute',
      width: 100,
      height: 100,
      bottom: 0,
      left: 0
    }
});
