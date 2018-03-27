import * as React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Other from './pages/Other';

export class App extends React.Component {
    public render() {
        return (
            <HashRouter>
                <div>
                    <Switch>
                        <Route
                            exact={true}
                            path="/"
                            component={() => <Redirect to="/home" />}
                        />
                        <Route key="/home" path="/home" component={Home} />
                        <Route key="/other" path="/other" component={Other} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}