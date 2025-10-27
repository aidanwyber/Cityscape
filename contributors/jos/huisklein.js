let width = 3840, height = 2160;
let x = width/2; let y = height/2; let n = height/25;
export function huizen() {
push();
 strokeWeight(10);
 fill(250, 199, 30);
 rect(x-20*n, y+4*n, 3*n, 3.5*n );//facade
 fill('#DB861E');
 rect(x-19.5*n, y+6*n, n, n*1.5 );//door
 fill('#20c6e8');
 rect(x-18*n, y+6*n, n*0.8, n*0.8 );//window
 strokeWeight(15);
 point(x-18.7*n, y+6.8*n);//doorknob
 noFill();

strokeWeight(4);
	push();
	  translate(x-18*n, y+3*n,); //cone as a roof
		rotate(PI);
		fill(250, 0, 0);
		pointLight(255,0,0, x, y-10*n, 0);
	  cone(1.5*n, 3*n);
  pop();

	push();
		translate(x-19.5*n,y+2*n); //Cylinden as a chimney
		rotate(PI);
		fill('#1FC0DB');
		pointLight(0,255,255, x, y-10*n, 0);
		cylinder(n*0.1, 3*n);
	pop();
pop();
}
