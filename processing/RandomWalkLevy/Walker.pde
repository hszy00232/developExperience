class Walker{
  float x,y;
  float prevX,prevY;
  Walker(){
    x = width/2;
    y = height/2;
  }
  void render(){
    stroke(255);
    line(prevX,prevY,x,y);
  }
  void step(){
    prevX = x;
    prevY = y;
    
    float stepX = random(-1,1);
    float stepY = random(-1,1);
    
    float stepsize = montecarlo()*50;
    stepX *= stepsize;
    stepY *= stepsize;
    
    x += stepX;
    y += stepY;
    
    x = constrain(x,0,width-1);
    y = constrain(y,0,height-1);
  }
}
float montecarlo(){
  while(true){
    float r1 = random(1);
    float probability = pow(1.0 - r1,8);
    
    float r2 = random(1);
    if(r2 < probability){
      return r1;
    }
  }
}
