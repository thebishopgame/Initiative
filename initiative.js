var initQueue = [];
var active = 0;
var inInit = false;
var focus = 0;

function character(name, init, dex) 
{
    if (typeof init === 'undefined')
        init = 10;
    if (typeof dex === 'undefined')
        dex = 10;
    
    this.name = name;
    this.init = init;
    this.dex = dex;
}

function compareInit(a,b)
{
    if (a.init < b.init)
        return 1;
    else if (a.init > b.init)
        return -1;
    else
    {
        if (a.dex < b.dex)
            return 1;
        else if (a.dex > b.dex)
            return -1;
    }
    return 0;
}

function addCharToList(char, index)
{
    $('#charList').append
    (
        "<li id=" + char.name + ">" + char.name + " " +
        "<div class=charControls>" +
        "<button class='control up' id=" + index + "><img class=controlimg src=img/uparrow.png></button>" +
        "<button class='control down' id=" + index + "><img class=controlimg src=img/downarrow.png height=30 width=30></button>" +
        "<button class='control hold' id=" + index + "><img class=controlimg src=img/holdclock.png></button>" +
        "<button class='control delete' id=" + index + "><img class=controlimg src=img/redx.png></button>" +
        "<button class='control pause' id=" + index + "><img class=controlimg src=img/pause.png></button></div>" +
        "</div>" +
        "<div class='initdex'>" +
        "<label class=inputLabel>Init</label>" +
        "<input type=number maxlength='2' min='0' max='99' class=init id=" + index + " value=" + char.init + ">" +
        "<label class=inputLabel>Dex</label>" +
        "<input type=number maxlength='2' min='0' max='99' class=dex id=" + index + " value=" + char.dex + ">" +
        "</li>"
    )
}

function addChar()
{
    initQueue.push(new character($('input[name=charName]').val()));
    addCharToList(initQueue[initQueue.length-1], initQueue.length-1);
    $('input[name=charName]').val('');
    
    if (initQueue.length > 1)
    {
        if (!inInit)
            $('#start').attr('disabled', false);
        
        $('#sortInit').attr('disabled', false);
    }
    
    saveState();
}

function makeInactive(index)
{
    $('#' + initQueue[index].name).animate({left: "-=10px"}, 100);
    $('#' + initQueue[index].name).removeClass('active');
}

function makeActive(index)
{
    $('#' + initQueue[index].name).animate({left: "+=10px"}, 100);
    $('#' + initQueue[index].name).addClass('active');
}

function saveState()
{
    localStorage.initQueue = JSON.stringify(initQueue);
    localStorage.active = JSON.stringify(active);
    localStorage.inInit = JSON.stringify(inInit);
}

function repopulate()
{
    $('#charList').empty();
    for(var i = 0; i < initQueue.length; i++)
    {
        addCharToList(initQueue[i],i);
    }
}

function setInInit(state)
{
    $('#start').attr('disabled', state);
    $('.inInit').attr('disabled', !state);
    
    if(inInit != state)    
    {
        inInit = state;
        if (initQueue.length > 1)
        {
            if(state)
                makeActive(active);
            else
            {
                makeInactive(active);
                active = 0;
            }
        }
    }
}

$(document).ready(function() 
{
    if(localStorage.getItem('active') !== null)
        active = JSON.parse(localStorage.active);
    
    if(localStorage.getItem('initQueue') !== null)
    {
        initQueue = JSON.parse(localStorage.initQueue);
        repopulate();
    }
    
    if(localStorage.getItem('inInit') !== null)
        setInInit(JSON.parse(localStorage.inInit));
    else
    {
        setInInit(inInit);
    }
    
    if (initQueue.length < 2)
    {
        $('#start').attr('disabled', true);
        $('#sortInit').attr('disabled', true);
    }
    
    $('input[name=charName]').keydown(function(key) 
    {
        if(parseInt(key.which) == 13) 
        {
            addChar();
            return false;
        }
    });
    
    $('#addButton').click(function() {
        addChar();
        return false;
    });
    
    $('#sortInit').click(function() {
        setInInit(false);
        initQueue.sort(compareInit);
        repopulate();
        $('#start').attr('disabled', false);
        $(this).blur();
        saveState();
    });

    $('#start').click(function() {
        setInInit(true);
        saveState();
    });

    $('#stop').click(function() {
        setInInit(false);
        saveState();
    });

    $('#next').click(function() {
        if(inInit)
        {
            makeInactive(active);
            if(++active > (initQueue.length-1))
                active = 0;
            makeActive(active);
        }
        
        saveState();
    });
    
    $(document).keydown(function(key) {
        switch(parseInt(key.keyCode)) {
            case 9:
                $('.delete[id=' + String(focus) + ']').focus(); //wtf? offset by 1 for some reason
                focus++;
                if(focus > initQueue.length-1)
                    focus = 0;
                break;
            
            case 27:
                setInInit(false);
                saveState();
                break;
            
            case 32:
                if(inInit)
                {
                    makeInactive(active);
                    if(++active > (initQueue.length-1))
                        active = 0;
                    makeActive(active);
                }
                else
                {
                    if (initQueue.length > 1)
                        setInInit(true);
                }
                
                saveState();
                break;
        }
    });
});

$(document).on('change', '.init', function()
{
    if(this.value.length > 1)
        this.value = (this.value).slice(0,2);
    initQueue[parseInt(this.id)].init = parseInt(this.value);
    saveState();
});

$(document).on('change', '.dex', function()
{
    initQueue[parseInt(this.id)].dex = parseInt(this.value);
    saveState();
});

$(document).on('click', '.delete', function() 
{
    var id = parseInt(this.id);
    if(inInit && (id == active))
        makeInactive(id);
    
    initQueue.splice(id, 1);
    repopulate();
    
    if(initQueue.length < 2)
    {
        setInInit(false);
        $('#start').attr('disabled', true);
        $('#sortInit').attr('disabled', true);
        active = 0;
    }
    else if(inInit)
    {
        if (active > initQueue.length-1)
            active = 0;
        makeActive(active);
    }
    
    saveState();
});

$(document).on('click', '.hold', function() 
{
    var id = parseInt(this.id);
    if(id < (initQueue.length-1))
    {
        var sel = $(this).parent().parent();
        var last = $('li[id=' + initQueue[initQueue.length-1].name + "]");
        
        sel.css({'z-index': 1});
        
        sel.fadeOut(150, function() {
            last.after(sel);
            if(inInit && id == active)
                makeActive(active);
            sel.fadeIn(150);
        });
        
        if(inInit && id == active)
            makeInactive(active);
        else if (id < active)
            active--;
         
        var char = initQueue[id];
        initQueue.splice(id, 1);
        initQueue.push(char);

        for (var i = id; i < initQueue.length; i++)
        {
            $('li[id=' + initQueue[i].name + ']').find('*').attr('id', i);
        }
    }
    
    saveState();
    
    $(this).blur();
});

$(document).on('click', '.up', function() 
{
    var id = parseInt(this.id);
    if (id > 0)
    {
        var sel = $(this).parent().parent();
        var prev = sel.prev();
        
        sel.fadeOut(100, function() {
            prev.before(sel);
            if(inInit && (id == active || id-1 == active))
                makeActive(active);
            sel.fadeIn(150);
        });
        
        prev.fadeOut(100, function() {
            prev.fadeIn(150);
        });
        
        if(inInit && (id == active || id-1 == active))
            makeInactive(active);
        
        sel.find('*').attr('id', id-1);
        prev.find('*').attr('id', id);
        
        var char = initQueue[id];
        initQueue[id] = initQueue[id-1];
        initQueue[id-1] = char;
    }
    
    saveState();
    
    $(this).blur();
});

$(document).on('click', '.down', function() 
{
    var id = parseInt(this.id);
    if (id < (initQueue.length-1))
    {
        var sel = $(this).parent().parent();
        var next = sel.next();
        
        sel.fadeOut(100, function() {
            next.after(sel);
            if(inInit && (id == active || id+1 == active))
                makeActive(active);
            sel.fadeIn(150);
        });
        
        next.fadeOut(100, function() {
            next.fadeIn(150);
        });
        
        if(inInit && (id == active || id+1 == active))
            makeInactive(active);
            
        sel.find('*').attr('id', id+1);
        next.find('*').attr('id', id);
        
        var char = initQueue[id];
        initQueue[id] = initQueue[id+1];
        initQueue[id+1] = char;
        
    }
    
    saveState();
    
    $(this).blur();
});

$(document).on('click', '#reset', function() 
{
    for (var i=0; i < initQueue.length; i++)
    {
        initQueue[i].init = 10;
        $('.init[id=' + String(i) + ']').val(10);
    }
    active = 0;
    
    saveState();
})

$(document).on('click', '#clear', function() 
{
    active = 0;
    initQueue = [];
    repopulate();
    setInInit(false);
    $('#start').attr('disabled', true);
    $('#sortInit').attr('disabled', true);
    
    saveState();
})
