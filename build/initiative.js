/** @jsx React.DOM */
/*global $:false */

function compareInit(a,b)
{
    var aInit = parseInt(a.total);
    var bInit = parseInt(b.total);
    
    if (aInit < bInit)
        return 1;
    else if (aInit > bInit)
        return -1;
    else
    {
        if (a.mod < b.mod)
            return 1;
        else if (a.mod > b.mod)
            return -1;
    }
    return 0;
}

var ReactTransitionGroup = React.addons.TransitionGroup;

// container and input box for adding new characters
var addCharBar = React.createClass({displayName: 'addCharBar',
    handleSubmit: function() {
        this.props.onAddChar(this.refs.charNameInput.getDOMNode().value);
        this.refs.charNameInput.getDOMNode().value = "";
        this.refs.charNameInput.getDOMNode().focus();
        return false;
    },
    handleFocus: function() {
        this.props.handleFocus();
    },
    handleBlur: function() {
        this.props.handleBlur();
    },
    render: function() {
        return (
            React.DOM.div( {className:"addCharContainer"}, "Name:",
                React.DOM.form( {className:"addCharForm", onSubmit:this.handleSubmit}, 
                    React.DOM.input( {autoFocus:true, ref:"charNameInput", 
                                     type:"text", 
                                     maxLength:"15",
                                     onFocus:this.handleFocus,
                                     onBlur:this.handleBlur,
                                     id:"charNameInput"}),
                    React.DOM.button( {className:"initControlButton addButton"}, "Add")
                )
            )
        );
    }
});

// a row in the inQueue representing a single character in initiative
var inChar = React.createClass({displayName: 'inChar',
    componentWillEnter: function(cb) {
        var $node = $(this.getDOMNode());
        
        $node.css("display", "none");
        $node.css("opacity", "0");
        $node.slideDown(100, function() {
            $node.transition({opacity: 1}, 100, cb);            
        });
    },
    componentDidEnter: function() {
        var $node = $(this.refs.charName.getDOMNode());
        if ($node.width() > 270) {
            $node.css("font-size",".7em");
            $node.css("top","-3px");
        }
    },
    componentDidMount: function() {
        var $node = $(this.refs.charName.getDOMNode());
        if ($node.width() > 270) {
            $node.css("font-size",".7em");
            $node.css("top","-3px");
        }
    },
    componentWillLeave: function(cb) {
        var $node = $(this.getDOMNode());
        
        $node.transition({opacity: 0}, 100, function() {
            $node.slideUp(100, "linear", cb);    
        });
    },
    handleUp: function() {
        this.refs.up.getDOMNode().blur();
        this.props.onCharUp(this.props.id);
        return false;
    },
    handleDown: function() {
        this.refs.down.getDOMNode().blur();
        this.props.onCharDown(this.props.id);
        return false;
    },
    handleHold: function() {
        this.refs.hold.getDOMNode().blur();
        this.props.onCharHold(this.props.id);
        return false;
    },
    handleDel: function() {
        this.refs.del.getDOMNode().blur();
        this.props.onCharDel(this.props.id);
        return false;
    },
    handlePause: function() {
        this.refs.pause.getDOMNode().blur();
        this.props.onCharPause(this.props.id);
        return false;
    },
    handleRollChange: function() {
        this.props.onRollChange(this.props.id, this.refs.roll.getDOMNode().value);
    },
    handleModChange: function() {
        this.props.onModChange(this.props.id, this.refs.mod.getDOMNode().value);
    },
    handleTotalChange: function() {
        this.props.onTotalChange(this.props.id, this.refs.total.getDOMNode().value);
    },
    handleKeyDown: function(e) {
        switch(parseInt(e.keyCode)) {
            case 13:
                this.refs.roll.getDOMNode().blur();
                break;
            
            case 27:
                this.refs.roll.getDOMNode().blur();
                break;
            
            default:
                break;
        }
    },
    render: function() {
        var id = "in" + this.props.id;
        
        var actClass = React.addons.classSet({
            "initCharContainer": true,
            "active": this.props.inInit && (this.props.id === this.props.active)
        });
        
        return (
            React.DOM.div( {id:id, className:actClass}, 
                React.DOM.div( {ref:"charName", className:"charName"}, this.props.charName),
                React.DOM.div( {className:"charControls"}, 
                    React.DOM.button( {className:"controlButton up", ref:"up", onClick:this.handleUp}
                    ),
                    React.DOM.button( {className:"controlButton down", ref:"down", onClick:this.handleDown}
                    ),
                    React.DOM.button( {className:"controlButton hold", ref:"hold", onClick:this.handleHold}
                    ),
                    React.DOM.button( {className:"controlButton del", ref:"del", onClick:this.handleDel}
                    ),
                    React.DOM.button( {className:"controlButton pause", ref:"pause", onClick:this.handlePause}
                    )
                ),
                React.DOM.div( {className:"rollmodtotal"}, 
                    React.DOM.div( {className:"labelRow"}, 
                        "Total   Roll    Mod"
                    ),
                    React.DOM.div( {className:"controlRow"}, 
                        React.DOM.input( {type:"number", 
                               onChange:this.handleTotalChange,
                               onKeyDown:this.handleKeyDown,
                               ref:"total",
                               maxlength:"2", 
                               min:"0", 
                               max:"99", 
                               className:"initInput", 
                               value:this.props.total,
                               id:"total"+this.props.id}),
                               "=",
                        React.DOM.input( {type:"number", 
                               onChange:this.handleRollChange,
                               onKeyDown:this.handleKeyDown,
                               ref:"roll",
                               maxlength:"2", 
                               min:"0", 
                               max:"99", 
                               className:"initInput", 
                               value:this.props.roll,
                               id:"roll"+this.props.id}),
                               "+",
                        React.DOM.input( {type:"number",
                               onChange:this.handleModChange,
                               ref:"mod",
                               maxlength:"2", 
                               min:"-99", 
                               max:"99",
                               className:"initInput", 
                               value:this.props.mod,
                               id:"mod"+this.props.id})
                    )
                )
            )
        );
    }
});

// a row in the outQueue representing a single character out of initiative
var outChar = React.createClass({displayName: 'outChar',
    componentWillEnter: function(cb) {
        var $node = $(this.getDOMNode());
        
        $node.css("display", "none");
        $node.css("opacity", "0");
        $node.slideDown(100, function() {
            $node.transition({opacity: 1}, 100, cb);            
        });
    },
    componentWillLeave: function(cb) {
        var $node = $(this.getDOMNode());
        
        $node.transition({opacity: 0}, 100, function() {
            $node.slideUp(100, "linear", cb);    
        });
    },
    handlePlay: function() {
        this.props.onCharPlay(this.props.id);
        return false;
    },
    handleDel: function() {
        this.props.onCharDel(this.props.id);
        return false;
    },
    handleRollChange: function() {
        this.props.onRollChange(this.props.id, this.refs.roll.getDOMNode().value);
    },
    handleModChange: function() {
        this.props.onModChange(this.props.id, this.refs.mod.getDOMNode().value);
    },
    handleTotalChange: function() {
        this.props.onTotalChange(this.props.id, this.refs.total.getDOMNode().value);
    },
    render: function() {
        return (
            React.DOM.div( {className:"initCharContainer"}, this.props.charName,
                React.DOM.div( {className:"charControls"}, 
                    React.DOM.button( {className:"controlButton play", onClick:this.handlePlay}
                    ),
                    React.DOM.button( {className:"controlButton del", onClick:this.handleDel}
                    )
                ),
                React.DOM.div( {className:"rollmodtotal"}, 
                    React.DOM.div( {className:"labelRow"}, 
                        "Total   Roll    Mod"
                    ),
                    React.DOM.div( {className:"controlRow"}, 
                        React.DOM.input( {type:"number", 
                               onChange:this.handleTotalChange,
                               onKeyDown:this.handleKeyDown,
                               ref:"total",
                               maxlength:"2", 
                               min:"0", 
                               max:"99", 
                               className:"initInput", 
                               value:this.props.total,
                               id:"total"+this.props.id}),
                               "=",
                        React.DOM.input( {type:"number", 
                               onChange:this.handleRollChange,
                               onKeyDown:this.handleKeyDown,
                               ref:"roll",
                               maxlength:"2", 
                               min:"0", 
                               max:"99", 
                               className:"initInput", 
                               value:this.props.roll,
                               id:"roll"+this.props.id}),
                               "+",
                        React.DOM.input( {type:"number",
                               onChange:this.handleModChange,
                               ref:"mod",
                               maxlength:"2", 
                               min:"-99", 
                               max:"99", 
                               className:"initInput", 
                               value:this.props.mod,
                               id:"mod"+this.props.id})
                    )
                )
            )
        );
    }
});

// the main in-initiative queue
var inQueueCmpt = React.createClass({displayName: 'inQueueCmpt',
    handleGen: function() {
        this.refs.gen.getDOMNode().blur();
        this.props.onGen();
    },
    
    handleSort: function() {
        this.refs.sort.getDOMNode().blur();
        this.props.onSort();
    },
    
    handleStartStop:function() {
        this.refs.startstop.getDOMNode().blur();
        this.props.onStartStop();
    },
    
    handleNext:function() {
        this.refs.next.getDOMNode().blur();
        this.props.onNext();
    },
    
    handleClear: function() {
        this.refs.clear.getDOMNode().blur();
        this.props.onClear();
    },
    
    render: function() {
        var chars = this.props.charList.map(function(char, i) {
            return inChar( {key:char.charName,
                           id:i,
                           charName:char.charName,
                           roll:char.roll,
                           mod:char.mod,
                           total:char.total,
                           onRollChange:this.props.onRollChange,
                           onModChange:this.props.onModChange,
                           onTotalChange:this.props.onTotalChange,
                           onCharUp:this.props.onCharUp,
                           onCharDown:this.props.onCharDown,
                           onCharHold:this.props.onCharHold,
                           onCharDel:this.props.onCharDel, 
                           onCharPause:this.props.onCharPause,
                           active:this.props.active,
                           inInit:this.props.inInit,
                           focused:this.props.focused});
        }.bind(this));
        
        var startstop = this.props.inInit ? "Stop" : "Start";
        
        return (
            React.DOM.div( {id:"inQueue", className:"queue"}, "Round:",this.props.round,
                ReactTransitionGroup(null, 
                    chars
                ),
                React.DOM.div( {className:"initControlBar"}, 
                    React.DOM.button( {className:"initControlButton",
                            ref:"gen",
                            onClick:this.handleGen}, 
                        "Generate"
                    ),React.DOM.div( {className:"initControlSpacer"}),
                    React.DOM.button( {className:"initControlButton",
                            ref:"sort",
                            onClick:this.handleSort}, 
                        "Sort"
                    ),React.DOM.div( {className:"initControlSpacer"}),
                    React.DOM.button( {className:"initControlButton StartStop",
                            ref:"startstop",
                            onClick:this.handleStartStop}, 
                        startstop
                    ),
                    React.DOM.button( {className:"initControlButton",
                            ref:"next",
                            onClick:this.handleNext}, 
                        "Next"
                    ),React.DOM.div( {className:"initControlSpacer"}),
                    React.DOM.button( {className:"initControlButton",
                            ref:"clear",
                            onClick:this.handleClear}, 
                        "Clear"
                    )
                )
            )
        );
    }
});

// the out-of-initiative queue, for those not in a given battle
var outQueueCmpt = React.createClass({displayName: 'outQueueCmpt',
    componentDidMount: function() {
        if (this.props.charList.length === 0)
            $(this.getDOMNode()).css("display","none");
    },
    render: function() {
        var id = 0;
        var chars = this.props.charList.map(function(char) {
            return outChar( {id:id++,
                            roll:char.roll,
                            mod:char.mod,
                            total:char.total,
                            onRollChange:this.props.onRollChange,
                            onModChange:this.props.onModChange,
                            onTotalChange:this.props.onTotalChange,
                            onCharPlay:this.props.onCharPlay,
                            onCharDel:this.props.onCharDel, 
                            charName:char.charName});
        }.bind(this));
        
        var hide = this.props.charList.length === 0 ? {display: "none"} : {display: "inline-block"};
        
        return (
            React.DOM.div( {id:"outQueue", className:"queue"}, 
                ReactTransitionGroup(null, 
                    chars
                )
            )
        );
    }
});

// main app class, also the state holder
var app = React.createClass({displayName: 'app',
    getInitialState: function() {
        if (localStorage.getItem("state") !== null)
            return JSON.parse(localStorage.state);
        else
            return {inQueue: [], 
                    outQueue: [], 
                    inInit: false, 
                    active: 0, 
                    focused: -1,
                    round: "-",
                    addFocus: true};
    },
    
    componentDidMount: function() {
        document.addEventListener("keydown", this.handleKeyDown);
        this.setState({addFocus: true});
    },
    
    saveState: function() {
        localStorage.state = JSON.stringify(this.state);
    },
    
    handleCharAdd: function(name) {
        if (name !== "") {
            var queue = this.state.inQueue;
            queue.push({charName:name, roll:10, mod:0, total:0});
            this.setState({inQueue: queue}, this.saveState);
        }
    },
    
    handleRollChangeIn: function(id, newRoll) {
        var queue = this.state.inQueue;

        queue[id].roll = newRoll;
        queue[id].total = parseInt(newRoll) + parseInt(queue[id].mod);
        this.setState({inQueue: queue}, this.saveState);
    },
    
    handleRollChangeOut: function(id, newRoll) {
        var queue = this.state.outQueue;
        
        queue[id].roll = newRoll;
        queue[id].total = parseInt(newRoll) + parseInt(queue[id].mod);
        this.setState({outQueue: queue}, this.saveState);
    },
    
    handleModChangeIn: function(id, newMod) {
        var queue = this.state.inQueue;
        
        queue[id].mod = newMod;
        queue[id].total = parseInt(newMod) + parseInt(queue[id].roll);
        this.setState({inQueue: queue}, this.saveState);
    },
    
    handleModChangeOut: function(id, newMod) {
        var queue = this.state.outQueue;
        
        queue[id].mod = newMod;
        queue[id].total = parseInt(newMod) + parseInt(queue[id].roll);
        this.setState({outQueue: queue}, this.saveState);
    },

    handleTotalChangeIn: function(id, newTotal) {
        var queue = this.state.inQueue;
        
        queue[id].total = newTotal;
        queue[id].roll = parseInt(newTotal) - parseInt(queue[id].mod);
        this.setState({inQueue: queue}, this.saveState);
    },
    
    handleTotalChangeOut: function(id, newTotal) {
        var queue = this.state.outQueue;
        
        queue[id].total = newTotal;
        queue[id].roll = parseInt(newTotal) - parseInt(queue[id].mod);
        this.setState({outQueue: queue}, this.saveState);
    },
    
    handleCharUp: function(id) {
        if (id > 0) {
            var queue = this.state.inQueue;
            var act = this.state.active;
            
            var goingUp = queue[id];
            queue[id] = queue[id-1];
            queue[id-1] = goingUp;
            
            if (this.state.inInit) {
                if(id == this.state.active)
                    act--;
                if(id-1 == this.state.active)
                    act++;
            }
            
            var $node = $(document.getElementById("in" + id));
            var $nodeAbove = $(document.getElementById("in" + (id-1)));
            
            $node.css("z-index","1");
            $nodeAbove.css("z-index","0");
            
            $node.transition({y: "-55"}, 100);
            $nodeAbove.transition({y: "55"}, 100);
            
            $.when($node, $nodeAbove).done(function() {
                this.setState({
                    inQueue: queue,
                    active: act
                }, this.saveState);  
    
                $node.css("y","0");
                $nodeAbove.css("y","0");
            }.bind(this));
        }
    },
    
    handleCharDown: function(id) {
        if (id < this.state.inQueue.length - 1) {
            var queue = this.state.inQueue;
            var act = this.state.active;
            
            var goingDown = queue[id];
            queue[id] = queue[id+1];
            queue[id+1] = goingDown;
            
            if (this.state.inInit) {
                if(id == this.state.active)
                    act++;
                if(id+1 == this.state.active)
                    act--;
            }
            
            var $node = $(document.getElementById("in" + id));
            var $nodeBelow = $(document.getElementById("in" + (id+1)));
            
            $node.css("z-index","1");
            $nodeBelow.css("z-index","0");
            
            $node.transition({y: "55"}, 100);
            $nodeBelow.transition({y: "-55"}, 100);
            
            $.when($node, $nodeBelow).done(function() {
                this.setState({
                    inQueue: queue,
                    active: act
                }, this.saveState);  
    
                $node.css("y","0");
                $nodeBelow.css("y","0");
            }.bind(this));
        }
    },
    
    handleCharHold: function(id) {
        var queue = this.state.inQueue;
        
        queue.push(queue[id]);
        queue.splice(id, 1);
        
        var $node = $(document.getElementById("in" + id));
        $node.css("z-index","1");
        
        var $allBelow = $();
        var cur;
        for (var i=id+1; i < queue.length; i++) {
            cur = document.getElementById("in"+i);
            $(cur).css("z-index","0");
            $allBelow = $allBelow.add(cur);
        }
        
        var numBelow = queue.length - 1 - id;
        $node.transition({y: numBelow*55}, 200);
        $allBelow.each(function() {
            $(this).transition({y: "-55"}, 200);
        });
        
        $.when($node, $allBelow).done(function() {
            this.setState({inQueue: queue}, this.saveState);
            $node.css("y","0");
            $allBelow.each(function() {
                $(this).css("y","0");
            });
        }.bind(this));
        
    },
    
    handleCharDelIn: function(id) {
        var queue = this.state.inQueue;
        var act = this.state.active;
        var newRound = this.state.round;
            
        queue.splice(id, 1);
        
        if (id < act)
            act--;
        
        if (act >= this.state.inQueue.length) {
            act = 0;
            if (this.state.inQueue.length === 0)
                newRound = "-";
        }
            
        var continueInit = false;
        
        if (this.state.inInit)    
            continueInit = queue.length < 1 ? false : true;
            
        this.setState({
            inQueue: queue,
            active: act,
            inInit: continueInit,
            round: newRound
        }, this.saveState);
    },
    
    handleCharDelOut: function(id) {
        var queue = this.state.outQueue;
        queue.splice(id, 1);
        
        if (queue.length < 1) {
            var $node = $(document.getElementById("outQueue"));
            $node.transition({opacity: 0}, 100, function() {
                $node.slideUp(100);
            });
        }
        
        this.setState({outQueue: queue}, this.saveState);
    },
    
    handleCharPause: function(id) {
        var inQ = this.state.inQueue;
        var outQ = this.state.outQueue;
        var act = this.state.active;
        var newRound = this.state.round;
        
        outQ.push(inQ[id]);
        inQ.splice(id, 1);
        
        if (act >= this.state.inQueue.length) {
            act = 0;
        }
        
        if (outQ.length === 1) {
            var $node = $(document.getElementById("outQueue"));
            $node.css("opacity","0");
            $node.css("display","inline-block");
            $node.slideDown(100, function() {
                $node.transition({opacity: 1}, 100);
            });
        }
        
        this.setState({
            inQueue: inQ,
            outQueue: outQ,
            active: act,
            round: newRound
        }, this.saveState);
    },
    
    handleCharPlay: function(id) {
        var inQ = this.state.inQueue;
        var outQ = this.state.outQueue;
        
        inQ.push(outQ[id]);
        outQ.splice(id, 1);
        
        if (outQ.length < 1) {
            var $node = $(document.getElementById("outQueue"));
            $node.transition({opacity: 0}, 100, function() {
                $node.slideUp(100);
            });
        }
        
        this.setState({
            inQueue: inQ,
            outQueue: outQ
        }, this.saveState);
    },
    
    handleSort: function() {
        var queue = this.state.inQueue;
        
        queue.sort(compareInit);
        this.setState({
            inQueue: queue,
            inInit: false,
            active: 0,
            round: "-"
        }, this.saveState);
    },
    
    handleGen: function() {
        var inQ = this.state.inQueue;
        var outQ = this.state.outQueue;
        
        for(var i=0; i<inQ.length; i++)
        {
            inQ[i].roll = Math.floor((Math.random() * 20) + 1);
            inQ[i].total = parseInt(inQ[i].roll) + parseInt(inQ[i].mod);
        }
        for(i=0; i<outQ.length; i++)
        {
            outQ[i].roll = Math.floor((Math.random() * 20) + 1);
            outQ[i].total = parseInt(outQ[i].roll) + parseInt(outQ[i].mod);
        }            
            
        inQ.sort(compareInit);
        console.log(inQ);
        
        this.setState({
            inQueue: inQ,
            outQueue: outQ,
            inInit: false,
            active: 0,
            round: "-"
        }, this.saveState);
    },
    
    handleStartStop: function() {
        if (this.state.inQueue.length > 0) {
            var state = !(this.state.inInit);
            if (state)
                this.setState({inInit: state, round: 1}, this.saveState);
            else
                this.setState({inInit: state, 
                               active: 0,
                               round: "-"
                }, this.saveState);
        }
    },
    
    handleNext: function() {
        var act = this.state.active;
        var newRound = this.state.round;
        
        if (this.state.inInit) {
            act++;
            if (act >= this.state.inQueue.length) {
                act = 0;
                newRound++;               
            }
                
            this.setState({
                active: act,
                round: newRound
            }, this.saveState);
        }
    },
    
    handleClear: function() {
        var inQ = this.state.inQueue;
        var outQ = this.state.outQueue;
        
        while(inQ.length > 0)
            inQ.pop();
        while(outQ.length > 0)
            outQ.pop();
            
        if (outQ.length < 1) {
            var $node = $(document.getElementById("outQueue"));
            $node.transition({opacity: 0}, 100, function() {
                $node.slideUp(100);
            });
        }
            
        this.setState({
            inQueue: inQ,
            outQueue: outQ,
            inInit: false,
            active: 0,
            round: "-"
        });

        this.saveState();
    },
    
    handleKeyDown: function(e) {
        switch(parseInt(e.keyCode)) {
            case 9:
                e.preventDefault();
                
                var curFocus = this.state.focused;
                if (++curFocus >= (this.state.inQueue.length * 3))
                    curFocus = 0;
                
                var focusId;
                switch(curFocus % 3) {
                    case 0:
                        focusId = "total"+Math.floor(curFocus/3);
                        break;
                    
                    case 1:
                        focusId = "roll"+Math.floor(curFocus/3);
                        break;
                    
                    case 2:
                        focusId = "mod"+Math.floor(curFocus/3);
                        break;
                }
                document.getElementById(focusId).focus();
                    
                this.setState({focused: curFocus}, this.saveState);
                break;
                
            case 27:
                if(!this.state.addFocus) {
                    this.setState({
                        inInit: false,
                        active: 0,
                        round: "-"
                    }, this.saveState);
                }
                else
                    document.getElementById("charNameInput").blur();
                break;
            
            case 32:
                if(!this.state.addFocus) {
                    e.preventDefault();
                    if(this.state.inInit) {
                        var act = this.state.active;
                        var newRound = this.state.round;
                        
                        if (++act >= (this.state.inQueue.length)) {
                            act = 0;
                            newRound++;
                        }
                        
                        this.setState({
                            active: act,
                            round: newRound
                        }, this.saveState);
                    }
                    else {
                        this.setState({
                            inInit: true,
                            active: 0,
                            round: 1
                        }, this.saveState);
                    }
                }
                break;
            case 65:
                if(!this.state.addFocus) {
                    e.preventDefault();
                    document.getElementById("charNameInput").focus();
                }
                break;
            
            case 71:
                if(!this.state.addFocus) {
                    e.preventDefault();
                    this.handleGen();
                }
                break;
                
            case 83:
                if(!this.state.addFocus) {
                    e.preventDefault();
                    this.handleSort();
                }
                break;
                
            default:
                break;
        }
    },
    
    handleAddFocus: function() {
        this.setState({addFocus: true});
    },
    
    handleAddBlur: function() {
        this.setState({addFocus: false});
    },
    
    render: function() {
        return (
            React.DOM.div(null, 
                addCharBar( {onAddChar:this.handleCharAdd,
                            handleFocus:this.handleAddFocus,
                            handleBlur:this.handleAddBlur}),
                inQueueCmpt( {charList:this.state.inQueue,
                             inInit:this.state.inInit,
                             active:this.state.active,
                             focused:this.state.focused,
                             round:this.state.round,
                             onRollChange:this.handleRollChangeIn,
                             onModChange:this.handleModChangeIn,
                             onTotalChange:this.handleTotalChangeIn,
                             onCharUp:this.handleCharUp,
                             onCharDown:this.handleCharDown,
                             onCharHold:this.handleCharHold,
                             onCharDel:this.handleCharDelIn,
                             onCharPause:this.handleCharPause,
                             onSort:this.handleSort,
                             onGen:this.handleGen,
                             onStartStop:this.handleStartStop,
                             onNext:this.handleNext,
                             onClear:this.handleClear}),
                outQueueCmpt( {charList:this.state.outQueue,
                              onRollChange:this.handleRollChangeOut,
                              onModChange:this.handleModChangeOut,
                              onTotalChange:this.handleTotalChangeOut,
                              onCharPlay:this.handleCharPlay,
                              onCharDel:this.handleCharDelOut})
            )
        );
    }
});

React.renderComponent(app(null ), document.getElementById('appContainer'));