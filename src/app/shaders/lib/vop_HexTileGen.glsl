 float fit(float src, float left, float right, float destLeft, float destRight) {

     float perc = (src - left)/(right - left);
     return destLeft + (destRight - destLeft) * perc;

 }

 int AND(int n1, int n2){

     float v1 = float(n1);
     float v2 = float(n2);

     int byteVal = 1;
     int result = 0;

     for(int i = 0; i < 32; i++){
         bool keepGoing = v1>0.0 || v2 > 0.0;
         if(keepGoing){

             bool addOn = mod(v1, 2.0) > 0.0 && mod(v2, 2.0) > 0.0;

             if(addOn){
                 result += byteVal;
             }

             v1 = floor(v1 / 2.0);
             v2 = floor(v2 / 2.0);
             byteVal *= 2;
         } else {
             return result;
         }
     }
     return result;
 }


 vec2 vop_HexTileGen(float u, float v, float fx, float fy, float ox, float oy) {
     float left;
     float right;
     int row;
     int col;

     v = v*fy - oy;
     row = int(floor(v));
     v  = fract(v);

     u = u*fx + ox;
     if (AND(row, 1) > 0){
        u += 0.5;
     }

     col = int(floor(u));
     u = fract(u);

     if (v > 0.5){
         right = v - 0.5;
         left  = 1.5 - v;

         if (u > left) {
             if (AND(row, 1) == 0) {
                 col++;
             }
             row++;
             v -= 1.0;
             u = fit(u, left, 1.0, 0.0, 0.5);
         } else if (u < right) {
             if (AND(row, 1) > 0) {
                 col--;
             }
             row++;
             v -= 1.0;
             u = fit(u, 0.0, right, 0.5, 1.0);
         } else {
             u = fit(u, right, left, 0.0, 1.0);
         }
     }
     v = (v*2.0+1.0)/3.0;
     return vec2(u, v);
 }
#pragma glslify: export(vop_HexTileGen)