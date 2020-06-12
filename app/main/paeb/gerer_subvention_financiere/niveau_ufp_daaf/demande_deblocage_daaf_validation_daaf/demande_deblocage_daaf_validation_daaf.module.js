(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf_validation_daaf', [])
        .run(notification)
        .config(config);
        var vs = {};
        var affichage;
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_demande_deblocage_daaf_validation_daaf', {
            url      : '/donnees-de-base/gerer_subvention_financiere/niveau_ufp_daaf/demande_deblocage_daaf_validation_daaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_ufp_daaf/demande_deblocage_daaf_validation_daaf/demande_deblocage_daaf_validation_daaf.html',
                    controller : 'Demande_deblocage_daaf_validation_daafController as vm'
                }
            },
            bodyClass: 'demande_deblocage_daaf_validation_daaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "demande_deblocage_daaf_validation_daaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf_validation_daaf', {
            title: 'V_demande par daaf',
            icon  : 'icon-link',
            state: 'app.paeb_gerer_subvention_financiere_niveau_ufp_daaf_demande_deblocage_daaf_validation_daaf',
            weight: 1,
            hidden:function()
            {
                    return affichage;
            }
        });
    }

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_daaf",Number(1)).then(function(result) 
            {
                var x = result.data.response;
                console.log(x);
                vs.content = x[0].nombre ;
                vs.color = '#F44336' ;
              

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DAAF","ADMIN"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_daaf",Number(1),"getcoutInvalide").then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != resultat[0].nombre) 
                        {
                            vs.content = resultat[0].nombre ;
                        };
                        
                    

                    });},15000) ;
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();
