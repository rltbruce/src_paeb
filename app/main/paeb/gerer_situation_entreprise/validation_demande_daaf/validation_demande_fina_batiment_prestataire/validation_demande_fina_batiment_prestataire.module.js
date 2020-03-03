(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.validation_demande_daaf.validation_demande_fina_batiment_prestataire', [])
        .run(notification)
        .config(config);

        var vs = {};
        var affichage;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_gerer_situation_entreprise_validation_demande_daaf_validation_demande_fina_batiment_prestataire', {
            url      : '/donnees-de-base/validation_demande_fina_batiment_prestataire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/gerer_situation_entreprise/validation_demande_daaf/validation_demande_fina_batiment_prestataire/validation_demande_fina_batiment_prestataire.html',
                    controller : 'Validation_demande_fina_batiment_prestataireController as vm'
                }
            },
            bodyClass: 'validation_demande_fina_batiment_prestataire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "validation_demande_fina_batiment_prestataire"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.gerer_situation_entreprise.validation_demande_daaf.validation_demande_fina_batiment_prestataire', {
            title: 'V_financière batiment',
            icon  : 'icon-blur-radial',
            state: 'app.paeb_gerer_situation_entreprise_validation_demande_daaf_validation_demande_fina_batiment_prestataire',
			weight: 6,
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
            
            apiFactory.getDemande_realimentationByInvalide("count_demande_prestataire",Number(3)).then(function(resul) 
            {
                var x = resul.data.response;
                vs.content = x[0].nombre ;
                vs.color = '#F44336' ;
              console.log(x);

            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DPFI"];
                affichage =  loginService.gestionMenu(permissions,permission);  

                //**************************************************
                if (id_user && !affichage) 
                {
                    $interval(function(){apiFactory.getDemande_realimentationByInvalide("count_demande_prestataire",Number(3)).then(function(resul) 
                    {
                        var resultat = resul.data.response;

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
