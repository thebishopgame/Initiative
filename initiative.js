var initQueue = [];
var active = 0;
var inInit = false;

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
    else if (a.init === b.init)
    {
        if (a.dex < b.dex)
            return 1;
        else if (a.dex > b.dex)
            return -1;
    }
    return 1;
}

function addChar(char, index)
{
    $('#charList').append
    (
        "<div class=charEntry' id=" + index +"><li id=" + char.name + ">" + char.name + " " +
        "<div class='initdex'>" +
        "<label class=input>Init</label>" +
        "<input type=number class=init id=" + index + " value=" + char.init + ">" +
        "<label class=input>Dex</label>" +
        "<input type=number class=dex id=" + index + " value=" + char.dex + ">" +
        "</div></li>" +
        " <button class=hold id=" + index + ">Hold</button>" +
        " <button class=delete id=" + index + ">Delete</button></div>"
    )
}

function makeInactive(index)
{
    $('#' + initQueue[index].name).animate({left: "-=10px"}, 'fast');
    $('#' + initQueue[index].name).removeClass('active');
}

function makeActive(index)
{
    $('#' + initQueue[index].name).animate({left: "+=10px"}, 'fast');
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
        addChar(initQueue[i],i);
    }
}

function setInit(state)
{
    if(inInit != state)    
    {
        inInit = state;
        $('#start').attr('disabled', state);
        if(state)
            makeActive(active);
        else
        {
            makeInactive(active);
            active = 0;
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
        setInit(JSON.parse(localStorage.inInit));
    
    $('input[name=charName]').keydown(function(key) 
    {
        if(parseInt(key.which) == 13) 
        {
            initQueue.push(new character($('input[name=charName]').val()));
            addChar(initQueue[initQueue.length-1], initQueue.length-1);
            $(this).val('');
            saveState();
            return false;
        }
    });
    
    $('#addButton').click(function() {
        initQueue.push(new character($('input[name=charName]').val()));
        addChar(initQueue[initQueue.length-1], initQueue.length-1);
        $('input[name=charName]').val('');
        saveState();
        return false;
    });
    
    $('#sortInit').click(function() {
        initQueue.sort(compareInit);
        repopulate();
        $('#start').attr('disabled', false);
        setInit(false);
        saveState();
    });

    $('#start').click(function() {
        setInit(true);
        saveState();
    });

    $('#stop').click(function() {
        setInit(false);
        saveState();
    });
    
    $(document).keydown(function(key) {
        switch(parseInt(key.keyCode)) {
            case 27:
                setInit(false);
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
                    setInit(true);
                }
                
                saveState();
                break;
        }
    });
});

$(document).on('change', '.init', function()
{
    initQueue[this.id].init = this.value;
    saveState();
});

$(document).on('change', '.dex', function()
{
    initQueue[this.id].dex = this.value;
    saveState();
});

$(document).on('click', '.delete', function() {
    if(inInit && this.id == active)
        makeInactive(this.id);
    
    initQueue.splice(this.id, 1);
    repopulate();
    
    if(inInit)
    {
        if (active > initQueue.length-1)
            active = 0;
        makeActive(active);
    }
    
    saveState();
});