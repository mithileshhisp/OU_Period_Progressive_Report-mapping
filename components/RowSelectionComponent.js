import React,{propTypes} from 'react';

export function RowSelectionComponent(props){
    var instance = Object.create(React.Component.prototype);
    instance.props = props;

    var init = props.init;
    var deGroupMap = init.des.reduce(function(map,de){

        if (de.dataElementGroups){
            for (var key in de.dataElementGroups){
                if(!map[de.dataElementGroups[key].id]){
                    map[de.dataElementGroups[key].id] = de.dataElementGroups[key];
                }
            }
        }
        return map;
    },[]);

    var deGroupList = [];
    for (var key in deGroupMap){
        deGroupList.push(deGroupMap[key]);
    }
    deGroupList.sort(function(a,b){
        
        return a.name > b.name ? 1:-1
    })
    
    var decocChangeState = function(){};
    
    var state = {
        de:"-1",
        degroup:"all",
        coc:"",
        ougroup:"",
        row:""
    };

    props.registerHandler(decocStuffCame);
    
    function decocStuffCame(decocState,_decocChangeState){
        
        state = decocState;
        state.degroup="all";
        instance.setState(state);
        decocChangeState = _decocChangeState;
        
    }

    
    function getDeOptions(){
        var options = init.des.reduce((list,obj)=>{
            //debugger
            if (state.degroup=="all" || checkIfGroupExists(obj.dataElementGroups,state.degroup)){
                list.push(<option key={obj.id} value={obj.id}>{obj.name}</option>);
            }
            return list;
        },[<option disabled value = "-1">--please select a de--</option>]);
        return options;

        function checkIfGroupExists(degs,current){
            for (var key in degs){
                if (degs[key].id == current){
                    return true;
                }
            }
            return false;
        }
    }

    function getDeGroupOptions(){
        var options = deGroupList.reduce((list,obj)=>{
            list.push(<option key={obj.id} value={obj.id}>{obj.name}</option>);
            return list;
        },[<option  value = "all">--all--</option>]);
        return options;
    }
    
    function getCOCOptions(){
        if (state.de == "-1"){return;}
        
        var coc = init.deMap[state.de].categoryCombo.categoryOptionCombos;

        var options = coc.reduce((list,obj) =>{
            list.push(<option value={obj.id}>{obj.name}</option>);
            return list;
        },[]);

        return options;
    }

    function getOUGOptions(){
        
        var options = [];        
        options =  init.ougs.reduce((list,obj)=>{            
            list.push(<option key={obj.id}
                      value={obj.id}>{obj.name}</option>);
            return list;
        },[<option value="nogroup">nogroup</option>]);
        
        return options;
    }
    
    function onDeChange(e){
        state.de = e.target.value;
        state.coc = init.deMap[state.de].categoryCombo.categoryOptionCombos[0].id
        instance.setState(state);        
        decocChangeState(state);
    }

    function onDeGroupChange(e){
        
        state.degroup = e.target.value;
        instance.setState(state);        
        decocChangeState(state);
    }
    
    function onCOCChange(e){
        state.coc = e.target.value;
        instance.setState(state);
        decocChangeState(state);
    }
    
    function onOUGroupChange(e){
        var selGroups = e.target.selectedOptions;
        
        var str = ""
        for (var key=0; key<selGroups.length;key++){
            var group = selGroups[key];
            if (str == ""){
                     str=group.value;
            }else{
                     str = str+"-"+group.value
            }
        }
        
        state.ougroup = str;
        instance.setState(state);
        decocChangeState(state);
    }

    function onRowChange(e){
        state.row = e.target.value;
        instance.setState(state);
        decocChangeState(state);
    }
    
    instance.render = function(){
        return (
                <div className="rowSelection">
                
              <table>
                <tbody>
                <tr> <td> Row : </td><td> <input type="number"
            value = {state.row}
            onChange={onRowChange}>
                </input>
                </td> </tr>

                <tr> <td>DE Group : </td>
                    <td><select className="decocDE"
                                value={state.degroup}
                                onChange={onDeGroupChange}
                                >{getDeGroupOptions()}
                      </select>
                  </td> </tr>
              
                  <tr> <td>DE : </td>
                    <td><select className="decocDE"
                                value={state.de}
                                onChange={onDeChange}
                                >{getDeOptions()}
                      </select>
                  </td> </tr>
                  
                  
                  <tr> <td> COC :</td>
                    <td> <select key={"coc"}
                                 value={state.coc}
                                 onChange={onCOCChange}
                                 > {getCOCOptions()}
                      </select>
                  </td> </tr>
                  
                  <tr> <td>OUGroup :</td><td> <select multiple
                                                      className="ougroupSelect"
                                                      key={"oug"}
                                                      value={state.ougroup.split("-") }
                                                      onChange = {onOUGroupChange}
                                                      > {getOUGOptions()}
                        
                      </select>
                  </td> </tr>
                  
                  
                  
                </tbody>
              </table>
                
                <pre>{JSON.stringify(state, null, 2) }</pre>
                
              
            </div>
            
        );
    };
    return instance;
}
