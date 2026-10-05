const {getPagination,getMeta}=require("../src/utils/pagination");
test("pagination clamps values",()=>{expect(getPagination({query:{page:"0",limit:"1000"}})).toMatchObject({page:1,limit:100});});
test("pagination meta calculates pages",()=>expect(getMeta(2,10,25)).toEqual({page:2,limit:10,total:25,totalPages:3,hasNext:true,hasPrev:true}));
