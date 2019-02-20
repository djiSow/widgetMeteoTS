import *  as React from "react";
import { WidgetProps } from "@talentsoft-opensource/integration-widget-contract"
import '../asset/widget.less'; 
import '../asset/image/logo-soleil.png';

interface Weather {
    name: string;
    temp: number;
    sky: string;
}

interface WidgetState {
    data:Weather[];
    textvalue:string;
    test:string;
}

export class Widget extends React.Component<WidgetProps,WidgetState> {
    constructor(props: WidgetProps) {
        super(props);
        this.defineActionHeaders(); 
        this.state = { 
            data:[],
            textvalue : "",
            test:"" 
        }
    }
    
    componentDidMount(){
        const {myTSHostService} = this.props;
        myTSHostService.setDataIsLoaded();
    }

    public getweather(c:string) {
        const {myTSHostService} = this.props;
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        let queryString = `?q=${c}&units=metric&appid=7848d30cce738e7887f77f176bb76f2c`;
       
        myTSHostService.requestExternalResource({verb: 'GET', url: url + queryString })
        .then((response) => {
            let data = [];
            try {
                data = JSON.parse(response.body);
            } 
            catch (e) {
                console.log(e);
            }  
            
            let weather:Weather= {
                name:data.name,
                temp:data.main.temp,
                sky:data.weather[0].main
            };
                 
            this.setState(prevState => ({
                data: [...prevState.data, weather]
            }));
        })
    }

    defineActionHeaders() {
        const {myTSHostService} = this.props;
        // Set to true to define your widget Logo as enlargeable
        myTSHostService.setHeaderActionConfiguration({enlargeable: false});
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ textvalue: e.target.value });
        console.log(e)
    }

    upperCaseF = (a:string) => {
        return a.charAt(0).toUpperCase() +a.slice(1);
    }

    getRandomTemp = (max: number) => {
        return Math.floor(Math.random() * Math.floor(max));
    } 
    
    remove(idx: number) {  
        // Concatening original items array returns new array - this is important!
        const items : Weather[] = this.state.data;
        items.splice(idx, 1);
        this.setState({data: items});
    }

    //récupère la donnée entrée dans le textvalue et lyaa push dans le array 
    handleAddTodoItem = () => {
        let city = this.upperCaseF(this.state.textvalue);
        if (city !== "" && !this.state.data.find(c => c.name === city)) {
            this.getweather(city);
        }
    }


    public render() {
        const items = this.state.data.map((item:Weather, i:number) => {
                      
            return (
             
                <div>
                    <li key={i}>
                        <div>{item.name +" "+ item.temp+"°c"+" "+item.sky+" "} 
                        <img src={require("../asset/image/logo-soleil.png")} id='myimage'/>
                            <button onClick={() => this.remove(i) }>-</button>
                        </div>
                    </li>
                </div>
            );
        }); 

        
      
        return (
            <div>
                {items}
                <input type="text" placeholder="ex : dublin" className="text" onChange={this.handleChange}/> 
                <button className="addbutton" onClick={this.handleAddTodoItem}> + </button>
            </div>
        );      
    }
}
