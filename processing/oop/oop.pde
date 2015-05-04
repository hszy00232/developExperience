class Car{
  color c;
  float xpos;
  float ypos;
  float xspeed;
  Car(){
    c = color(255);
    xpos = width/2;
    ypos = height/2;
    xspeed = 1;
  }
  void display(){
    rectMode(CENTER);
    fill(c);
    rect(xpos,ypos,20,10);
  }
  void drive(){
    xpos = xpos + xspeed;
    if(xpos > width){
      xpos = 0;
    }
  }
}

Car myCar;
void setup(){
  size(200,200);
  myCar = new Car();
}
void draw(){
  background(255);
  myCar.drive();
  myCar.display();
}
