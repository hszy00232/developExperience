Walker w;
void setup(){
  size(640,480);
  w = new Walker();
  background(0);
}
void draw(){
  w.step();
  w.render();
}
