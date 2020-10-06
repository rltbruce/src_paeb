(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_daaf_etat.demande_deblocage_daaf_validation_ufp_etat', [])        
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_etat_subvention_financiere_niveau_ufp_daaf_etat_demande_deblocage_daaf_validation_ufp_etat', {
            url      : '/donnees-de-base/etat_subvention_financiere/niveau_ufp_daaf_etat/demande_deblocage_daaf_validation_ufp_etat',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/etat_subvention_financiere/niveau_ufp_daaf_etat/demande_deblocage_daaf_validation_ufp_etat/demande_deblocage_daaf_validation_ufp_etat.html',
                    controller : 'Demande_deblocage_daaf_validation_ufp_etatController as vm'
                }
            },
            bodyClass: 'demande_deblocage_daaf_validation_ufp_etat',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_deblocage_daaf_validation_ufp_etat"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.etat_subvention_financiere.niveau_ufp_daaf_etat.demande_deblocage_daaf_validation_ufp_etat', {
            title: 'Etat activité financier UFP/DAAF',
            icon  : 'icon-link',
            state: 'app.paeb_etat_subvention_financiere_niveau_ufp_daaf_etat_demande_deblocage_daaf_validation_ufp_etat',
            weight: 1
        });
    }


})();
