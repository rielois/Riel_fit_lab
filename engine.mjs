export const frontLabels = ['Reference top','Reference bottom','Left shoulder tip','Right shoulder tip','Shoulder neck point','Bust apex','Waist below bust apex','Knee below shoulder','Floor below shoulder','Side waist','Skirt hem','Trouser hem','Bust left edge','Bust right edge','Waist left edge','Waist right edge','Hip left edge','Hip right edge'];
export const sideLabels = ['Reference top','Reference bottom','Bust front edge','Bust back edge','Waist front edge','Waist back edge','Hip front edge','Hip back edge'];
export function distance(a,b) { return Math.hypot(a.x-b.x,a.y-b.y); }
export function scale(points, cm) {
 if (!Number.isFinite(cm) || cm < 30 || cm > 250) throw Error('Use a measured vertical reference between 30 and 250 cm.');
 if (!points[0] || !points[1]) throw Error('Mark both reference ends.');
 const pixels=distance(points[0],points[1]);
 if(pixels<100) throw Error('Reference must span at least 100 image pixels. Retake closer or use a longer reference.');
 if(Math.abs(points[0].x-points[1].x)/pixels>0.04) throw Error('Reference is tilted. Keep camera level and reference vertical.');
 return cm/pixels;
}
export function ellipse(width,depth) {
 if(!Number.isFinite(width)||!Number.isFinite(depth)||width<=0||depth<=0) throw Error('Invalid body cross section.');
 const a=width/2,b=depth/2,h=((a-b)/(a+b))**2;
 return Math.PI*(a+b)*(1+3*h/(10+Math.sqrt(4-3*h)));
}
export function measure(front, side) {
 if(front.points.length!==frontLabels.length || side.points.length!==sideLabels.length) throw Error('Finish all landmarks in both views.');
 const f=front.points,s=side.points,fs=scale(f,front.referenceCm),ss=scale(s,side.referenceCm);
 const out=[];
 const line=(name,a,b,kind='Projected straight length')=>{
  const value=distance(f[a],f[b])*fs;
  if(value<3||value>220) throw Error(`${name}: check the marked endpoints.`);
  out.push({name,cm:value,method:kind,status:'Unvalidated camera estimate'});
 };
 for(const [name,i,j] of [['Bust',12,2],['Waist',14,4],['Hip',16,6]]) {
  const fw=Math.abs(f[i].x-f[i+1].x),sd=Math.abs(s[j].x-s[j+1].x);
  if(Math.abs(f[i].y-f[i+1].y)>Math.max(5,fw*.05)||Math.abs(s[j].y-s[j+1].y)>Math.max(5,sd*.05)) throw Error(`${name}: edges must be at the same horizontal level within each image.`);
  const w=fw*fs,d=sd*ss;
  if(w<10||w>80||d<8||d>65) throw Error(`${name}: implausible cross section; check calibration and edges.`);
  out.push({name,cm:ellipse(w,d),method:'Front width + side depth; ellipse approximation',status:'Circumference estimate; confirm with tape'});
 }
 line('Skirt length',9,10); line('Trouser length (outseam)',9,11);
 line('Shoulder to knee',4,7); line('Shoulder to shoulder',2,3);
 line('Shoulder to floor',4,8); line('Shoulder to bust point',4,5);
 line('Shoulder to waist',4,6);
 return out;
}
