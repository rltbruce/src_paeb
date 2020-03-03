(function ()
{
    'use strict';

    var tab = [
            'app.paeb.accueil',
            'app.paeb.auth.login',
            'app.paeb.auth.register',
            'app.paeb.auth.forgot-password',
            'app.paeb.auth.reset-password',
            'app.paeb.auth.lock',
            'app.paeb.administration',
            'app.paeb.ddb',
            'app.paeb.gerer_subvention_financiere',
            'app.paeb.gerer_situation_feffi',
            'app.paeb.gerer_convention_ufp_daaf',
            'app.paeb.gerer_situation_entreprise',
            'app.paeb.gerer_situation_moe',
            'app.paeb.gerer_situation_pr'
        ] ;

    angular
        .module('app.paeb', tab.sort())
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('paeb', {
            title : 'Menu Principale',
            group : true,
            weight: 1
        });

         $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('DD/MM/YYYY') : new Date(NaN);
        };
  
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }
})();
