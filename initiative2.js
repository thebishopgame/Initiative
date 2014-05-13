/** @jsx React.DOM */
/*global $:false */

function compareInit(a,b)
{
    var aInit = a.init + a.bonus;
    var bInit = b.init + b.bonus;
    
    if (aInit < bInit)
        return 1;
    else if (aInit > bInit)
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

// container and input box for adding new characters
var addCharBar = React.createClass({
    handleSubmit: function() {
        this.props.onAddChar(this.refs.charNameInput.getDOMNode().value);
        this.refs.charNameInput.getDOMNode().value = "";
        return false;
    },
    render: function() {
        return (
            <div className="addCharContainer">Name:
                <form className="addCharForm" onSubmit={this.handleSubmit}>
                    <input ref="charNameInput" type="text" maxLength="15"/>
                    <button id="addButton">Add</button>
                </form>
            </div>
        );
    }
});

// a row in the inQueue representing a single character in initiative
var inChar = React.createClass({
    handleUp: function() {
        this.props.onCharUp(this.props.id);
        this.refs.up.getDOMNode().blur();
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
    handleInitChange: function() {
        this.props.onInitChange(this.props.id, this.refs.init.getDOMNode().value);
    },
    handleBonusChange: function() {
        this.props.onDexChange(this.props.id, this.refs.bonus.getDOMNode().value);
    },
    handleDexChange: function() {
        this.props.onBonusChange(this.props.id, this.refs.dex.getDOMNode().value);
    },
    render: function() {
        return (
            <li>{this.props.charName}
                <div className="charControls">
                    <button ref="up" onClick={this.handleUp}>
                        <img className="controlimg" src="img/uparrow.png" />
                    </button>
                    <button ref="down" onClick={this.handleDown}>
                        <img className="controlimg" src="img/downarrow.png" />
                    </button>
                    <button ref="hold" onClick={this.handleHold}>
                        <img className="controlimg" src="img/holdclock.png" />
                    </button>
                    <button ref="del" onClick={this.handleDel}>
                        <img className="controlimg" src="img/redx.png" />
                    </button>
                    <button ref="pause" onClick={this.handlePause}>
                        <img className="controlimg" src="img/pause.png" />
                    </button>
                </div>
                <div className="initdex">
                    <label className="inputLabel">Init</label>
                    <input type="number" 
                           onChange={this.handleInitChange}
                           ref="init"
                           maxlength="2" 
                           min="0" 
                           max="99" 
                           className="initInput" 
                           defaultValue="10"/>
                    <label className="inputLabelLong">Bonus</label>
                    <input type="number"
                           onChange={this.handleBonusChange}
                           ref="bonus"
                           maxlength="2" 
                           min="-99" 
                           max="99" 
                           className="initInput" 
                           defaultValue="0"/>
                    <label className="inputLabel">Dex</label>
                    <input type="number"
                           onChange={this.handleDexChange}
                           ref="dex"
                           maxlength="2" 
                           min="0" 
                           max="99" 
                           className="initInput" 
                           defaultValue="10"/>
                </div>
            </li>
        );
    }
});

// a row in the outQueue representing a single character out of initiative
var outChar = React.createClass({
    handlePlay: function() {
        this.props.onCharPlay(this.props.id);
        return false;
    },
    handleDel: function() {
        this.props.onCharDel(this.props.id);
        return false;
    },
    handleInitChange: function() {
        this.props.onInitChange(this.refs.init.getDOMNode().value);
    },
    handleBonusChange: function() {
        this.props.onDexChange(this.refs.bonus.getDOMNode().value);
    },
    handleDexChange: function() {
        this.props.onBonusChange(this.refs.dex.getDOMNode().value);
    },
    render: function() {
        return (
            <li>{this.props.charName}
                <div className="charControls">
                    <button className="control play" onClick={this.handlePlay}>
                        <img className="controlimg" src="img/play.png" />
                    </button>
                    <button className="control delete" onClick={this.handleDel}>
                        <img className="controlimg" src="img/redx.png" />
                    </button>
                </div>
                <div className="initdex">
                    <label className="inputLabel">Init</label>
                    <input type="number" 
                           onChange={this.handleInitChange}
                           ref="init"
                           maxlength="2" 
                           min="0" 
                           max="99" 
                           className="initInput" 
                           value="10"/>
                    <label className="inputLabelLong">Bonus</label>
                    <input type="number"
                           onChange={this.handleBonusChange}
                           ref="bonus"
                           maxlength="2" 
                           min="-99" 
                           max="99" 
                           className="initInput" 
                           value="0"/>
                    <label className="inputLabel">Dex</label>
                    <input type="number"
                           onChange={this.handleDexChange}
                           ref="dex"
                           maxlength="2" 
                           min="0" 
                           max="99" 
                           className="initInput" 
                           value="10"/>
                </div>
            </li>
        );
    }
});

// the main in-initiative queue
var inQueueCmpt = React.createClass({
    render: function() {
        var id = 0;
        var chars = this.props.charList.map(function(char) {
            return <inChar id={id++} 
                           onInitChange={this.props.onInitChange}
                           onBonusChange={this.props.onBonusChange}
                           onDexChange={this.props.onDexChange}
                           onCharUp={this.props.onCharUp}
                           onCharDown={this.props.onCharDown}
                           onCharHold={this.props.onCharHold}
                           onCharDel={this.props.onCharDel} 
                           onCharPause={this.props.onCharPause}
                           charName={char.charName}/>;
        }.bind(this));
        
        return (
            <div id="inQueue" className="queue">
                <ol>{chars}</ol>
                <div className='initControl'>
                    <button className='initControlButton' onClick={this.handleGen}>
                        Generate
                    </button>&nbsp;&nbsp;
                    <button className='initControlButton' onClick={this.handleSort}>
                        Sort
                    </button>&nbsp;&nbsp;
                    <button className='initControlButton' onClick={this.handleStart}>
                        Start
                    </button>
                    <button className='initControlButton' onClick={this.handleNext}>
                        Next
                    </button>&nbsp;&nbsp;
                    <button className='initControlButton' onClick={this.handleReset}>
                        Reset Init
                    </button>
                    <button className='initControlButton' onClick={this.handleClear}>
                        Clear
                    </button>
                </div>
            </div>
        );
    }
});

// the out-of-initiative queue, for those not in a given battle
var outQueueCmpt = React.createClass({
    render: function() {
        var hide = this.props.charList.length > 0 ? false : true;
        var hideStyle;
        if(hide)
            hideStyle = {display: 'none'};
        else
            hideStyle = {display: 'inline-block'};
        
        var id = 0;
        var chars = this.props.charList.map(function(char) {
            return <outChar id={id++} 
                            onInitChange={this.props.onInitChange}
                            onBonusChange={this.props.onBonusChange}
                            onDexChange={this.props.onDexChange}
                            onCharPlay={this.props.onCharPlay}
                            onCharDel={this.props.onCharDel} 
                            charName={char.charName}/>;
        }.bind(this));
        
        return (
            <div id="outQueue" style={hideStyle} className="queue">
                <ol>
                    {chars}
                </ol>
            </div>
        );
    }
});

// main app class, also the state holder
var app = React.createClass({
    getInitialState: function() {
        if (localStorage.getItem("state") !== null)
            return JSON.parse(localStorage.state);
        else
            return {inQueue: [], outQueue: []};
    },
    
    saveState: function() {
        localStorage.state = JSON.stringify(this.state);
    },
    
    handleCharAdd: function(name) {
        var queue = this.state.inQueue;
        queue.push({charName:name, init:10, bonus:0, dex:10});
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleInitChangeIn: function(id, newInit) {
        var queue = this.state.inQueue;

        queue[id].init = newInit;
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleInitChangeOut: function(id, newInit) {
        var queue = this.state.outQueue;
        
        queue[id].init = newInit;
        
        this.setState({
            outQueue: queue
        });
        
        this.saveState();
    },
    
    handleBonusChangeIn: function(id, newBonus) {
        var queue = this.state.inQueue;
        
        queue[id].bonus = newBonus;
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleBonusChangeOut: function(id, newBonus) {
        var queue = this.state.outQueue;
        
        queue[id].bonus = newBonus;
        
        this.setState({
            outQueue: queue
        });
        
        this.saveState();
    },
    
    handleDexChangeIn: function(id, newDex) {
        var queue = this.state.inQueue;
        
        queue[id].dex = newDex;
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleDexChangeOut: function(id, newDex) {
        var queue = this.state.outQueue;
        
        queue[id].dex = newDex;
        
        this.setState({
            outQueue: queue
        });
        
        this.saveState();
    },
    
    handleCharUp: function(id) {
        if (id > 0) {
            var queue = this.state.inQueue;
            
            var goingUp = queue[id];
            queue[id] = queue[id-1];
            queue[id-1] = goingUp;
            
            this.setState({
                inQueue: queue
            });
        }
        
        this.saveState();
    },
    
    handleCharDown: function(id) {
        if (id < this.state.inQueue.length - 1) {
            var queue = this.state.inQueue;
            
            var goingDown = queue[id];
            queue[id] = queue[id+1];
            queue[id+1] = goingDown;
            
            this.setState({
                inQueue: queue
            });
        }
        
        this.saveState();
    },
    
    handleCharHold: function(id) {
        var queue = this.state.inQueue;
        
        queue.push(queue[id]);
        queue.splice(id, 1);
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleCharPause: function(id) {
        var inqueue = this.state.inQueue;
        var outqueue = this.state.outQueue;
        
        outqueue.push(inqueue[id]);
        inqueue.splice(id, 1);
        this.setState({
            inQueue: inqueue,
            outQueue: outqueue
        });
        
        this.saveState();
    },
    
    handleCharPlay: function(id) {
        var inqueue = this.state.inQueue;
        var outqueue = this.state.outQueue;
        
        inqueue.push(outqueue[id]);
        outqueue.splice(id, 1);
        this.setState({
            inQueue: inqueue,
            outQueue: outqueue
        });
        
        this.saveState();
    },
    
    handleCharDelIn: function(id) {
        var queue = this.state.inQueue;
        queue.splice(id, 1);
        
        this.setState({
            inQueue: queue
        });
        
        this.saveState();
    },
    
    handleCharDelOut: function(id) {
        var queue = this.state.outQueue;
        queue.splice(id, 1);
        
        this.setState({
            outQueue: queue
        });
        
        this.saveState();
    },
    render: function() {
        return (
            <div>
                <addCharBar onAddChar={this.handleCharAdd} />
                <inQueueCmpt charList={this.state.inQueue} 
                             onInitChange={this.handleInitChangeIn}
                             onBonusChange={this.handleBonusChangeIn}
                             onDexChange={this.handleDexChangeIn}
                             onCharUp={this.handleCharUp}
                             onCharDown={this.handleCharDown}
                             onCharHold={this.handleCharHold}
                             onCharDel={this.handleCharDelIn}
                             onCharPause={this.handleCharPause}
                             onSort={this.handleSort}/>
                <outQueueCmpt charList={this.state.outQueue}
                              onInitChange={this.handleInitChangeOut}
                              onBonusChange={this.handleBonusChangeOut}
                              onDexChange={this.handleDexChangeOut}
                              onCharPlay={this.handleCharPlay}
                              onCharDel={this.handleCharDelOut}/>
            </div>
        );
    }
});

React.renderComponent(<app />, document.getElementById('appContainer'));