package tree_sitter_mbx_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_mbx "github.com/arcelyth/tree-sitter-mbx/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mbx.Language())
	if language == nil {
		t.Errorf("Error loading Mbx grammar")
	}
}
