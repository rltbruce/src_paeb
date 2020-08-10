(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.piece_justificatif_prevu.piece_justificatif_feffi_prevu', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.paeb_ddb_piece_justificatif_prevu_piece_justificatif_feffi_prevu', {
            url      : '/donnees-de-base/piece_justificatif_feffi_prevu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/paeb/ddb/piece_justificatif_prevu/piece_justificatif_feffi_prevu/piece_justificatif_feffi_prevu.html',
                    controller : 'Piece_justificatif_feffi_prevuController as vm'
                }
            },
            bodyClass: 'piece_justificatif_feffi_prevu',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "piece_justificatif_feffi_prevu"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.piece_justificatif_prevu.piece_justificatif_feffi_prevu', {
            title: 'Pièce justificative prévue FEFFI',
            icon  : 'icon-clipboard-outline',
            state: 'app.paeb_ddb_piece_justificatif_prevu_piece_justificatif_feffi_prevu'
        });
    }

})();
