var openIns = true;
var has_pin = false;
var showLikes = false;
var collection = new Array();
var animTimer = null;
var maxWait = 0;
var iCount = 0;
var error = 0;
var swip_collection = null;
var current_cell= null;
var cells = null;
var rows = null;
var current_row = -1;
var start_inx = -1;
function createHeart(col)
{
    if (is_ie_8)
    {
         return "http://lh3.googleusercontent.com/-72ayRN8l-8g/UqnYTkciOBI/AAAAAAAAAoo/VIsvXNsFXn8/w14-h10-no/matrix_like.png";
    }
    var canvas = document.createElement("canvas");
    canvas.height = 12; canvas.width = 14;
    var context = canvas.getContext("2d");
    canvas.x = 0;
    canvas.y = 0;
    var w = canvas.width;
    var h = canvas.height;
    context.fillStyle = col;
    var d = Math.max(w,h);
    var k = 0;
    context.moveTo(k,k + d / 4);
    context.quadraticCurveTo(k,k,k + d / 4,k);
    context.quadraticCurveTo(k + d / 2,k,k + d / 2,k + d / 4);
    context.quadraticCurveTo(k + d / 2,k,k + d * 3 / 4,k);
    context.quadraticCurveTo(k + d,k,k + d,k + d / 4);
    context.quadraticCurveTo(k + d,k + d / 2,k + d / 2,d * 0.75);
    context.quadraticCurveTo(k,k + d / 2,k,k + d / 4);
    context.fill();
    return canvas.toDataURL();
}
function pinit(e) {
    var t = e.currentTarget.parentNode.parentNode.getElementsByTagName('a')[0];
    var guid = ""; for (var b = 0; b < 12; b += 1) guid = guid + "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz".substr(Math.floor(60 * Math.random()), 1);
    window.open("http://www.pinterest.com/pin/create/button/?guid=" + guid + "-" + t.inx.toString() + "&url=" + encodeURIComponent(t.a) + "&media=" + encodeURIComponent(t.m) + "&description=" + encodeURIComponent(t.d), "pin" + (new Date).getTime(), "status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=632,height=270,left=0,top=0");
    e.preventDefault();
    e.stopPropagation();
    return false;
}
function getImageUrl(path)
{
    if(path.url)
    {
        return path.url;
    }else{
        return path;
    }
}
function showImage(img)
{
    if(img.parentNode.parentNode != null )
    {
        iCount++;
        img.parentNode.title = img.alt;
        img.parentNode.setAttribute("dstate","enter");
        if (server_collage_cont.getElementsByTagName('img').length <= iCount && location.search.indexOf("&na=true") < 0)
        {
            setTimeout(swipRow,3500);
        }
    }
}
function swipRow()
{
    if(start_inx < 0)
    {
        var num_of_cells = gallery.rows.length * gallery.rows[0].cells.length;
        if(num_of_cells < feed.data.length)
        {
            start_inx = num_of_cells;
        }else{
            start_inx = (num_of_cells%feed.data.length);
        }
    }
    current_row++;
    if(current_row >= gallery.rows.length)
    {
        current_row = 0;
    }
    swip_collection = new Array();
    for(var i=0;i<gallery.rows[current_row].cells.length;i++)
    {
        var data = feed.data[start_inx];
        var a = document.createElement('a');
        if(!openIns)
        {
            a.href = "http://users.instush.com/p/" + data.id;
        }else{
            a.href = data.link;
        }
        if (data.caption != null) {
            a.title = "Photo by @" + data.user.username + " - " + data.caption.text;
            if (has_pin) {
                a.d = "Photo by @" + data.user.username + " - " + data.caption.text;
            }
        } else if (has_pin) {
            a.d = "Photo by @" + data.user.username;
        }
        a.target = '_blank';
        var img = document.createElement('img');
        img.setAttribute('onload','cellLoaded(this);');
        a.appendChild(img);
        if(showLikes)
        {
            var likes = document.createElement('div');
            likes.innerHTML = '<span>' + data.likes.count.toString() + '</span>';
            a.appendChild(likes);
        }
        gallery.rows[current_row].cells[i].children[0].appendChild(a);
        img.src = getImageUrl(data.images[size_prop]).replace("http:","");
        if (has_pin) {
            a.m = data.images.standard_resolution.url;
            a.inx = start_inx;
            a.a = a.href;
        }
        start_inx++;
        if(start_inx >= feed.data.length)
        {
            start_inx = 0;
        }
    }
}
function cellLoaded(img)
{
    swip_collection.push(img.parentNode);
    if(swip_collection.length == gallery.rows[current_row].cells.length)
    {
        swipItem();
    }
}
function removeOut()
{
    var row = gallery.rows[current_row];
    for(var i=0;i<row.cells.length;i++)
    {
        if(row.cells[i].children[0].children.length > 1)
        {
            if(row.cells[i].children[0].children[0].getAttribute("dstate") == "out")
            {
                row.cells[i].children[0].removeChild(row.cells[i].children[0].children[0]);
                if(i == row.cells.length - 1)
                {
                    animTimer = setTimeout(swipRow,3500);
                }
                return;
            }
        }
    }
}
function swipItem()
{
    var row = gallery.rows[current_row];
    for(var i=0;i<row.cells.length;i++)
    {
        if(row.cells[i].children[0].children.length > 1)
        {
            if(row.cells[i].children[0].children[0].getAttribute("dstate") != "out")
            {
                
                row.cells[i].children[0].children[0].setAttribute("dstate","out");
                if(row.cells[i].children[0].children[1].getAttribute("dstate") != "in")
                {
                    row.cells[i].children[0].children[1].setAttribute("dstate","in");
                }
                setTimeout(swipItem,300);
                setTimeout(removeOut,700);
                return;
            }
        }
    }
}
function init()
{
    if (error == 0)
    {
        if (!is_ie_8 && document.getElementById("phead").getAttribute("has_pin") != null)
        {
            var tds = document.getElementsByTagName('td');
            for (var i = 0; i < tds.length; i++)
            {
                var _l_width = parseInt(tds[i].className.replace("photo",""));
                var _l_spanp = document.createElement('span');
                _l_spanp.className = "pinp";
                var _l_span = _l_spanp.appendChild(document.createElement('span'));
                _l_span.className = "pin";
                tds[i].children[0].children[0].a = tds[i].children[0].children[0].href;
                var src = tds[i].children[0].children[0].children[0].src;
                tds[i].children[0].children[0].m = src.substr(0,src.length - 6) + "_n.jpg";
                tds[i].children[0].children[0].d = tds[i].children[0].children[0].getAttribute('d');
                tds[i].children[0].children[0].inx = i;
                _l_spanp.style.width = _l_width.toString() + "px";
                _l_span.addEventListener('click',pinit,false);
                tds[i].appendChild(_l_spanp);
            }
            has_pin = true;
        }
    } else if (error == 1)
    {
        document.write('<div class="errorMsg" >Sorry, we currently cannot show this photo feed. This user photos feed is private!</div>');
    } else
    {
        document.write('<div class="errorMsg" >Sorry, we currently cannot show this photos feed, please try later!</div>');
    }
}
