(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.validation_demande_paiement_pr_bcaf.validation_demande_batiment_pr_bcaf', [])
        .run(notification)
        .config(config);

        var vs = {};
        var affichage;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_pr_validation_demande_paiement_pr_bcaf_validation_demande_batiment_pr_bcaf', {
            url      : '/donnees-de-base/validation_demande_batiment_pr_bcaf',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_pr/validation_demande_paiement_pr_bcaf/validation_demande_batiment_pr_bcaf/validation_demande_batiment_pr_bcaf.html',
                    controller : 'Validation_demande_batiment_pr_bcafController as vm'
                }
            },
            bodyClass: 'validation_demande_batiment_pr_bcaf',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "validation_demande_batiment_pr_bcaf"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_pr.validation_demande_paiement_pr_bcaf.validation_demande_batiment_pr_bcaf', {
            title: 'VD_Batiment pr',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_pr_validation_demande_paiement_pr_bcaf_validation_demande_batiment_pr_bcaf',
			weight: 2,
            badge:vs,
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
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_batiment_pr",Number(1)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = x[0].nombre ;
                vs.color = '#F44336' ;
              console.log(x);

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["BCAF"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_batiment_pr",Number(1)).then(function(result) 
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
